import MapReader from './MapReader.js';
import PaletteView from './views/sidebars/PaletteView.js';
import LevelListView from './views/sidebars/LevelListView.js';
import NodeListView from './views/sidebars/NodeListView.js';
import PropertyListView from './views/sidebars/PropertyListView.js';
import MapNode from './map/MapNode.js';
import LayerListView from './views/sidebars/LayerListView.js';
import MapOptionsView from './views/sidebars/MapOptionsView.js';
import RandomizerListView from './views/sidebars/RandomizerListView.js';
import RandomizerOption from './map/RandomizerOption.js';
import TriggerListView from './views/sidebars/TriggerListView.js';
import TriggerEditorView from './views/sidebars/TriggerEditorView.js';
import Trigger from './map/Trigger.js';
import ToolbarView from './views/ToolbarView.js';
import StatusBarView from './views/StatusBarView.js';
import MapWriter from './MapWriter.js';
import MapView from './views/MapView.js';
import MapNodeContextMenuView from './views/MapNodeContextMenuView.js';

// noinspection CssInvalidHtmlTagReference
export default class MapEditor {

    constructor(context) {
        this.context = context;
        this.uiNodeFactory = context.getUiNodeFactory();
        this.mapView = new MapView(context);
        this.reader = new MapReader(context);
        this.writer = new MapWriter(context);
        this.toolbarView = new ToolbarView(context);
        this.statusBarView = new StatusBarView(context);
        this.levelListView = new LevelListView(context);
        this.paletteView = new PaletteView(context);
        this.layerListView = new LayerListView(context);
        this.nodeListView = new NodeListView(context);
        this.propertyListView = new PropertyListView(context);
        this.triggerListView = new TriggerListView(context);
        this.triggerEditorView = new TriggerEditorView(context);
        this.mapOptionsView = new MapOptionsView(context);
        this.randomizerListView = new RandomizerListView(context);
        this.mapNodeContextMenuView = new MapNodeContextMenuView();

        this.$sidebars = $('.sidebar');
        this.$brush = null;

        this.$mainAreaContainer = $('.main-area-container');
        this.$mainAreaOverlay = $('.main-area-overlay');

        this.map = null;
        this.currentLevelFilename = null;

        this.bindListeners();
        this.mapView.setAllLayersActive();
        this.reloadDataFromServer();
    }

    reloadDataFromServer() {
        let workspacePath = this.context.getWorkspacePath();

        this.statusBarView.setWorkspacePath(workspacePath);

        if (!workspacePath) {
            return;
        }

        let levelList = this.context.loadLevelList();

        this.levelListView.setLevelList(levelList);
    }

    bindListeners() {
        this.$sidebars.on('click', 'a.sidebar-tab-link', e => {
            let $link = $(e.currentTarget);
            let $sidebar = $link.closest('.sidebar');

            let hasOpenedTab = $sidebar.find('a.sidebar-tab-link:not(.collapsed)').length > 0;
            $sidebar.toggleClass('active', hasOpenedTab);
        });



        this.mapView.setClickListener((mapNode, e) => {
            if (this.$brush) {
                this.addNodeFromBrush();
                this.setLevelDirty();

            } else {
                if (e.shiftKey) {
                    this.nodeListView.addNodeToSelection(mapNode);

                } else if (e.ctrlKey) {
                    this.nodeListView.removeNodeFromSelection(mapNode);

                } else if (e.altKey) {
                    setTimeout(() => {
                        this.mapNodeContextMenuView.showAt(e.clientX, e.clientY);
                    }, 100);

                } else {
                    this.nodeListView.setSelectedNodes(mapNode ? [mapNode] : []);
                }
            }
        });

        this.mapView.setRightClickListener((mapNode, e) => {
            this.mapNodeContextMenuView.showAt(e.clientX, e.clientY);
        });

        this.mapView.setDoubleClickListener(mapNode => {
            this.$sidebars.find('#node-list-sidebar-tab').collapse('show');
            this.nodeListView.scrollToNode(mapNode);
        });

        this.mapView.setMouseMoveListener((x, y) => {
            if (this.$brush) {
                let viewportPosition = this.mapView.getViewportPosition();

                this.uiNodeFactory.setNodeProperty(this.$brush, 'x', x - viewportPosition.x);
                this.uiNodeFactory.setNodeProperty(this.$brush, 'y', y - viewportPosition.y);
            }

            this.statusBarView.setMousePosition(x, y);
        });

        this.mapView.setDragNodesListener((x, y) => {
            let selectedMapNodes = this.nodeListView.getSelectedNodes();

            for (const mapNode of selectedMapNodes) {
                this.mapView.moveNodeBy(mapNode, x, y);
            }

            this.propertyListView.fillFromMapNodes(selectedMapNodes);
            this.setLevelDirty();
        });



        this.paletteView.setSelectionChangedListener((tagName, typeName, name) => {
            if (this.hasLoadedLevel()) {
                if (tagName === 'terrain') {
                    let terrain = this.context.createTerrainByName(typeName);

                    this.map.setTerrain(terrain);
                    this.mapView.setTerrain(terrain);
                    this.setLevelDirty();
                } else {
                    this.setBrush(tagName, typeName, name);
                }
            }
        });

        this.paletteView.setTabOpenedListener(tagName => {
            if (this.hasLoadedLevel()) {
                if (tagName === 'terrain') {
                    this.paletteView.setSelectedType('terrain', this.map.terrain.name);
                }
            }
        });



        this.levelListView.addFileClickListener(filename => {
            if (this.currentLevelFilename === filename) {
                return;
            }

            if (this.isLevelDirty()) {
                MapEditor.#showModal('alert', 'Сперва необходимо сохранить изменения');
                return;
            }

            this.loadLevel(filename);
        });



        this.layerListView.setSelectionChangedListener(layerNames => {
            this.mapView.setActiveLayers(layerNames);
            this.nodeListView.setActiveLayers(layerNames);
        });



        this.nodeListView.setSelectionChangedListener(mapNodes => {
            this.mapView.setSelectedNodes(mapNodes);
            this.propertyListView.fillFromMapNodes(mapNodes);
        });

        this.nodeListView.setElementDoubleClickListener(mapNode => {
            this.mapView.setViewportCenter(mapNode.x, mapNode.y);
        });

        this.nodeListView.setNodeVisibilityChangedListener((mapNode, isVisible) => {
            this.mapView.setNodeVisible(mapNode, isVisible);
        });

        this.nodeListView.setCenterNodeButtonClickListener(mapNode => {
            this.mapView.setViewportCenter(mapNode.x, mapNode.y);
        });

        this.nodeListView.setRemoveNodeButtonClickListener(mapNode => {
            this.removeNode(mapNode);
            this.setLevelDirty();
        });


        this.propertyListView.setPropertyChangedListener((propertyName, newValue) => {
            let selectedNodes = this.nodeListView.getSelectedNodes();

            for (const mapNode of selectedNodes) {
                this.mapView.setNodeProperty(mapNode, propertyName, newValue);
                this.setLevelDirty();
            }
        });


        this.mapOptionsView.setControlChangedListener(e => {
            if (e.isCheckbox) {
                let propertyNames = this.mapOptionsView.getPropertyNamesForControl(e.controlName);

                for (const propertyName of propertyNames) {
                    if (e.newValue) {
                        let value = this.mapOptionsView.getPropertyValue(propertyName);

                        this.setMapPropertyValue(propertyName, value);
                        this.setLevelDirty();
                    } else {
                        this.setMapPropertyValue(propertyName, null);
                        this.setLevelDirty();
                    }
                }

            } else {
                this.setMapPropertyValue(e.propertyName, e.newValue);
                this.setLevelDirty();
            }
        });


        this.triggerListView.setAddButtonListener(triggerTitle => {
            let trigger = new Trigger(triggerTitle);

            this.map.addTrigger(trigger);
            this.triggerEditorView.setTrigger(trigger);
            this.triggerListView.addTrigger(trigger);
            this.triggerListView.setSelectedTrigger(trigger);
            this.triggerListView.scrollToTrigger(trigger);
            this.triggerListView.clearNewTriggerInputs();
            this.setLevelDirty();
        });

        this.triggerListView.setSelectionChangedListener(trigger => {
            this.triggerEditorView.setTrigger(trigger);
        });

        this.triggerListView.setTriggerRepeatingChangedListener((trigger, isRepeating) => {
            trigger.repeat = isRepeating;
            this.setLevelDirty();
        });

        this.triggerListView.setTriggerActivityChangedListener((trigger, isEnabled) => {
            if (isEnabled) {
                trigger.removeAllStatementsOfType('never');
            } else {
                trigger.addStatement('<never/>');
            }
            this.setLevelDirty();
        });

        this.triggerListView.setRemoveTriggerButtonClickListener(trigger => {
            this.map.removeTrigger(trigger);
            this.triggerListView.removeTrigger(trigger);
            this.triggerEditorView.setTrigger(null);
            this.setLevelDirty();
        });


        this.triggerEditorView.setTitleChangedListener((title, trigger) => {
            if (!trigger) {
                return;
            }

            trigger.title = title;
            this.setLevelDirty();
        });

        this.triggerEditorView.setContentChangedListener((statements, trigger) => {
            if (!trigger) {
                return;
            }

            trigger.statements = statements;
            this.setLevelDirty();
        });


        this.randomizerListView.setRandomizerChangedListener((randomizer, newCount) => {
            randomizer.count = newCount;
            this.setLevelDirty();
        });

        this.randomizerListView.setAddRandomizerButtonListener((item, count) => {
            let randomizer = new RandomizerOption(item, count);

            this.map.options.addRandomizer(randomizer);
            this.randomizerListView.addRandomizer(randomizer);
            this.randomizerListView.clearAddRandomizerInputs();
            this.setLevelDirty();
        });

        this.randomizerListView.setRemoveRandomizerButtonClickListener(randomizer => {
            this.map.options.removeRandomizer(randomizer);
            this.randomizerListView.removeRandomizer(randomizer);
            this.setLevelDirty();
        });



        this.toolbarView.setResetLevelButtonListener(() => {
            MapEditor.#showModal('confirm', {
                message: 'Сбросить все несохраненные изменения?',
                onConfirm: () => this.resetCurrentLevel(),
            });
        });

        this.toolbarView.setSaveLevelButtonListener(() => {
            this.saveCurrentLevel();
        });

        this.toolbarView.setDownloadLevelButtonListener(() => {
            this.downloadCurrentLevel();
        });



        this.statusBarView.setEditWorkspacePathButtonListener(() => {
            this.statusBarView.setEditWorkspaceModeActive(true);
        });

        this.statusBarView.setSaveWorkspacePathButtonListener(() => {
            let oldValue = this.context.getWorkspacePath();
            let newValue = this.statusBarView.getWorkspacePath();

            this.statusBarView.setEditWorkspaceModeActive(false);

            if (oldValue !== newValue) {
                this.context.setWorkspacePath(newValue);
                this.context.reloadDataFromServer();
                this.statusBarView.setWorkspacePath(newValue);
                this.reloadDataFromServer();
            }
        });



        this.mapView.setMoveActionListener((x, y) => {
            let selectedMapNodes = this.nodeListView.getSelectedNodes();

            for (const mapNode of selectedMapNodes) {
                this.mapView.moveNodeBy(mapNode, x, y);
                this.setLevelDirty();
            }
        });



        $(window).on('keydown', e => {
            let code = e.code;

            if (e.ctrlKey || e.metaKey) {
                if (code === 'KeyS') {
                    e.preventDefault();
                    this.saveCurrentLevel();
                }
                if (code === 'KeyA') {
                    e.preventDefault();
                    let visibleNodes = this.nodeListView.getVisibleNodes();

                    this.nodeListView.setSelectedNodes(visibleNodes);
                }
            }

            if (!e.ctrlKey && !e.shiftKey && !e.altKey) {
                if (code === 'Delete') {
                    let selectedMapNodes = this.nodeListView.getSelectedNodes();

                    for (const mapNode of selectedMapNodes) {
                        this.removeNode(mapNode);
                        this.setLevelDirty();
                    }
                }

                if (code === 'Escape') {
                    if (this.hasBrush()) {
                        this.paletteView.setSelectedItem(null);
                        this.clearBrush(null);
                    }
                }
            }
        });
    }

    resetCurrentLevel() {
        let filename = this.levelListView.getSelectedFile();

        this.loadLevel(filename);
    }

    saveCurrentLevel() {
        let filename = this.levelListView.getSelectedFile();
        let levelXml = this.mapToXml(this.map);

        this.context.saveLevel(filename, levelXml);
        this.setLevelClear();
    }

    downloadCurrentLevel() {
        let fullPath = this.levelListView.getSelectedFile();
        let filename = fullPath.split(/\//g).pop();
        let levelXml = this.mapToXml(this.map);

        downloadXml(filename, levelXml);

        MapEditor.#showModal('alert', {
            message: `В игре файл должен храниться здесь:\nИГРА/${fullPath}`,
        });
    }

    setMapPropertyValue(propertyName, value) {
        let source = this.mapOptionsView.getPropertySource(propertyName);
        let propertyHolder = source === 'map' ? this.map : this.map.options;

        propertyHolder[propertyName] = value;

        if (propertyName === 'width') {
            this.mapView.setMapWidth(value);
        }

        if (propertyName === 'height') {
            this.mapView.setMapHeight(value);
        }

        if (propertyName === 'fowClearColor') {
            this.mapView.setFowClearColor(value);
        }
    }

    loadLevel(filename) {
        let mapXml = this.context.loadXml(filename);
        let map = this.reader.readLevel(mapXml);

        this.map = map;
        this.currentLevelFilename = filename;

        this.nodeListView.clearNodes();
        this.triggerListView.clearTriggers();

        this.levelListView.setSelectedFile(filename);
        this.mapOptionsView.setMap(map);
        this.randomizerListView.fillFromMap(map);

        this.mapView.clearNodes();

        this.mapView.setTerrain(map.terrain);
        this.paletteView.setSelectedType('terrain', map.terrain.name);

        this.mapView.setMapSize(map.width, map.height);
        this.mapView.setFowClearColor(map.options.fowClearColor);

        let allTagNames = this.context.getAllTagNames();

        for (const tagName of allTagNames) {
            let mapNodes = map.getNodesOfType(tagName);

            for (let mapNode of mapNodes) {
                this.mapView.addNode(mapNode);
                this.nodeListView.addNode(mapNode);
            }
        }

        for (const trigger of map.triggers) {
            this.triggerListView.addTrigger(trigger);
        }

        this.mapView.setViewportCenter(map.startX ?? map.playerBaseX, map.startY ?? map.playerBaseY);

        this.setLevelClear();
    }

    addNodeFromBrush() {
        let viewportPosition = this.mapView.getViewportPosition();
        let brushMapNode = this.$brush.data('map-node');
        let mapNode = brushMapNode.clone();

        mapNode.x += viewportPosition.x;
        mapNode.y += viewportPosition.y;

        this.map.addNode(mapNode);
        this.mapView.addNode(mapNode);
        this.nodeListView.addNode(mapNode);
    }

    setBrush(tagName, typeName, name) {
        if (this.$brush) {
            this.$brush.remove();
            this.$brush = null;
        }

        if (tagName) {
            this.$brush = this.createBrush(tagName, typeName, name);
            this.$mainAreaOverlay.append(this.$brush);
        }
    }

    hasBrush() {
        return this.$brush !== null;
    }

    clearBrush() {
        this.setBrush(null);
    }

    createBrush(tagName, typeName, name) {
        let mapNode = new MapNode(tagName, -1000, -1000);

        mapNode.type = typeName;
        mapNode.name = name;

        if (tagName === 'area') {
            mapNode.radius = 128;
        }

        let $node;

        if (this.context.isMarkerNode(tagName)) {
            $node = this.uiNodeFactory.createMarkerNode(tagName, typeName, mapNode);
        } else {
            if (tagName === 'item' && typeName === 'Chest') {
                tagName = 'chest';
            }

            $node = this.uiNodeFactory.createNode(tagName, typeName, mapNode);
        }

        return $node;
    }

    removeNode(mapNode) {
        this.map.removeNode(mapNode);
        this.mapView.removeNode(mapNode);
        this.nodeListView.removeNode(mapNode);
    }

    mapToXml(map) {
        let writtenMapXml = this.writer.writeLevel(map);

        let xmlSerializer = new XMLSerializer();
        let serializedXml = xmlSerializer.serializeToString(writtenMapXml);

        return reformatXml(serializedXml);
    }

    isLevelDirty() {
        return this.levelListView.isSelectedLevelDirty();
    }

    setLevelDirty() {
        this.levelListView.setSelectedLevelDirty(true);
    }

    setLevelClear() {
        this.levelListView.setSelectedLevelDirty(false);
    }

    hasLoadedLevel() {
        return this.currentLevelFilename !== null;
    }

    static #showModal(modalType, options) {
        if (typeof options === 'string') {
            options = {
                message: options,
            };
        }

        if (modalType === 'alert') {
            alert(options.message);
            return;
        }

        if (modalType === 'confirm') {
            let confirmed = confirm(options.message);

            if (confirmed) {
                options.onConfirm();
            }

            return;
        }

        throw new Error('Unsupported modalType: ' + modalType);
    }
}