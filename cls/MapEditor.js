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

// noinspection CssInvalidHtmlTagReference
export default class MapEditor {

    constructor(context, uiNodeFactory) {
        this.context = context;
        this.uiNodeFactory = uiNodeFactory;
        this.reader = new MapReader(context);
        this.writer = new MapWriter(context);
        this.toolbarView = new ToolbarView(context, uiNodeFactory);
        this.statusBarView = new StatusBarView(context, uiNodeFactory);
        this.levelListView = new LevelListView(context, uiNodeFactory);
        this.paletteView = new PaletteView(context, uiNodeFactory);
        this.layerListView = new LayerListView(context, uiNodeFactory);
        this.nodeListView = new NodeListView(context, uiNodeFactory);
        this.propertyListView = new PropertyListView(context, uiNodeFactory);
        this.triggerListView = new TriggerListView(context, uiNodeFactory);
        this.triggerEditorView = new TriggerEditorView(context, uiNodeFactory);
        this.mapOptionsView = new MapOptionsView(context, uiNodeFactory);
        this.randomizerListView = new RandomizerListView(context, uiNodeFactory);

        this.$sidebars = $('.sidebar');
        this.$mainAreaContainer = $('.main-area-container');
        this.$mapScroll = $('.map-scroll');
        this.$map = $('.map');
        this.$mapNodeList = $('.map-node-list');
        this.$mainAreaOverlay = $('.main-area-overlay');
        this.$brush = null;

        this.mapScrollPadding = 300;
        this.map = null;
        this.currentLevelFilename = null;

        this.$mainAreaContainer.attr('tabindex', -1);

        // BUG: Элемент с mix-blend-mode вызывает глитчи в интерфейсе, на местах, где нет background-color/image,
        // поэтому просто удаляю этот элемент, чтобы эта фича не работала, но код для нее остался.
        this.$mainAreaOverlay.remove();

        this.bindListeners();
        this.createScrollController();
        this.setAllLayersActive();
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



        this.$map.on('mousedown', '.map-node .selection-box', e => {
            this.$map.data('should-process-click', true);
        });

        this.$map.on('mousemove', e => {
            this.$map.data('should-process-click', false);
        });

        this.$map.on('click', '.map-node .selection-box', e => {
            if (!this.$map.data('should-process-click')) {
                return;
            }

            let $node = $(e.currentTarget).closest('.map-node-root');
            let mapNode = $node.data('map-node');

            if (this.$brush) {
                this.addNodeFromBrush();
                this.setLevelDirty();
            } else {
                if (e.shiftKey) {
                    this.nodeListView.addNodeToSelection(mapNode);

                } else if (e.ctrlKey) {
                    this.nodeListView.removeNodeFromSelection(mapNode);

                } else {
                    this.nodeListView.setSelectedNodes([mapNode]);
                }
            }

            this.$mainAreaContainer.focus();
        });

        this.$map.on('dblclick', '.map-node .selection-box', e => {
            let mapNodes = this.nodeListView.getSelectedNodes();
            let mapNode = mapNodes[0];

            this.$sidebars.find('#node-list-sidebar-tab').collapse('show');
            this.nodeListView.scrollToNode(mapNode);
        });

        this.$mainAreaContainer.mousemove(e => {
            let mapOffset = this.$map.offset();
            let x = e.pageX - mapOffset.left;
            let y = e.pageY - mapOffset.top;

            if (this.$brush) {
                this.uiNodeFactory.setNodeProperty(this.$brush, 'x', x);
                this.uiNodeFactory.setNodeProperty(this.$brush, 'y', y);
            }

            this.statusBarView.setMousePosition(x, y);
        });


        this.paletteView.setSelectionChangedListener((tagName, typeName, name) => {
            if (this.hasLoadedLevel()) {
                if (tagName === 'terrain') {
                    let terrain = this.context.createTerrainByName(typeName);

                    this.map.setTerrain(terrain);
                    this.setTerrain(terrain);
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
            this.setActiveLayers(layerNames);
            this.nodeListView.setActiveLayers(layerNames);
        });



        this.nodeListView.setSelectionChangedListener(mapNodes => {
            let editorIds = mapNodes.map(mapNode => mapNode.editorId);

            this.$map.find('.map-node').each((index, nodeElement) => {
                let $node = $(nodeElement);
                let nodeEditorId = +$node.data('editor-id');

                $node.toggleClass('selected', editorIds.includes(nodeEditorId));
            });

            this.propertyListView.fillFromMapNodes(mapNodes);
        });

        this.nodeListView.setElementDoubleClickListener(mapNode => {
            this.setViewportCenter(mapNode.x, mapNode.y);
        });

        this.nodeListView.setNodeVisibilityChangedListener((mapNode, isVisible) => {
            let $node = this.findMapNodeElement(mapNode);

            $node.toggleClass('hidden', !isVisible);
        });

        this.nodeListView.setCenterNodeButtonClickListener(mapNode => {
            this.setViewportCenter(mapNode.x, mapNode.y);
        });

        this.nodeListView.setRemoveNodeButtonClickListener(mapNode => {
            this.removeNode(mapNode);
            this.setLevelDirty();
        });


        this.propertyListView.setPropertyChangedListener((propertyName, newValue) => {
            let selectedNodes = this.nodeListView.getSelectedNodes();

            for (const mapNode of selectedNodes) {
                let $node = this.findMapNodeElement(mapNode);

                this.uiNodeFactory.setNodeProperty($node, propertyName, newValue);
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
            this.triggerListView.addTrigger(trigger);
            this.triggerListView.setSelectedTrigger(trigger);
            this.triggerListView.clearNewTriggerInputs();
            this.triggerListView.scrollToTrigger(trigger);
            this.triggerEditorView.clearInputs();
            this.setLevelDirty();
        });

        this.triggerListView.setSelectionChangedListener(trigger => {
            if (trigger) {
                this.triggerEditorView.fillFromTrigger(trigger);
            } else {
                this.triggerEditorView.clearInputs();
            }
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
            this.triggerEditorView.fillFromTrigger(trigger);
            this.setLevelDirty();
        });

        this.triggerListView.setRemoveTriggerButtonClickListener(trigger => {
            this.map.removeTrigger(trigger);
            this.triggerListView.removeTrigger(trigger);
            this.triggerEditorView.clearInputs();
            this.setLevelDirty();
        });


        this.triggerEditorView.setTitleChangedListener(title => {
            let trigger = this.triggerListView.getSelectedTrigger();

            trigger.title = title;
            this.setLevelDirty();
        });

        this.triggerEditorView.setContentChangedListener(statements => {
            let trigger = this.triggerListView.getSelectedTrigger();

            trigger.statements = statements;

            let isEnabled = !trigger.hasStatementOfType('never');

            this.triggerListView.setTriggerActive(trigger, isEnabled);
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



        this.$mainAreaContainer.on('keydown', e => {
            let code = e.code;

            if (code.startsWith('Arrow')) {
                e.preventDefault();

                let x = (code === 'ArrowRight') - (code === 'ArrowLeft');
                let y = (code === 'ArrowDown') - (code === 'ArrowUp');
                let multiplier = 5;

                if (e.shiftKey) {
                    x *= multiplier;
                    y *= multiplier;
                }

                if (e.ctrlKey) {
                    x *= multiplier;
                    y *= multiplier;
                }

                if (!e.altKey) {
                    x *= multiplier;
                    y *= multiplier;
                }

                let selectedMapNodes = this.nodeListView.getSelectedNodes();

                for (const mapNode of selectedMapNodes) {
                    let $node = this.findMapNodeElement(mapNode);

                    this.uiNodeFactory.moveNodeBy($node, x, y);
                    this.setLevelDirty();
                }
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

    setMapPropertyValue(propertyName, value) {
        let source = this.mapOptionsView.getPropertySource(propertyName);
        let propertyHolder = source === 'map' ? this.map : this.map.options;

        propertyHolder[propertyName] = value;

        if (propertyName === 'width') {
            this.setMapWidth(value);
        }

        if (propertyName === 'height') {
            this.setMapHeight(value);
        }

        if (propertyName === 'fowClearColor') {
            this.setFowClearColor(value);
        }
    }

    findMapNodeElement(mapNode) {
        return this.$map.find(`.map-node.map-node-root[data-editor-id='${mapNode.editorId}']`);
    }

    createScrollController() {
        let $draggedNode = null;
        let lastDragOffset = {x: 0, y: 0};

        // noinspection JSUnusedGlobalSymbols
        this.scrollController = new ScrollBooster({
            viewport: this.$mapScroll[0],
            scrollMode: 'native',
            friction: 0,
            bounce: false,
            onPointerDown: (state, e) => {
                if (e.button === 1) {
                    this.scrollController.props.friction = 0;

                } else if (e.button === 0) {
                    this.scrollController.props.friction = 1;

                    let $node = this.getNodeFromEvent(e);

                    if ($node?.is('.selected')) {
                        $draggedNode = $node;
                    }
                }
            },
            onPointerUp: (state, e) => {
                if (e.button === 1) {
                    this.scrollController.props.friction = 1;

                } else if (e.button === 0) {
                    this.scrollController.props.friction = 1;
                    $draggedNode = null;
                    lastDragOffset = {x: 0, y: 0};
                }
            },
            onPointerMove: (state, e) => {
                if ($draggedNode) {
                    let movedBy = {
                        x: state.dragOffset.x - lastDragOffset.x,
                        y: state.dragOffset.y - lastDragOffset.y,
                    };
                    lastDragOffset = {...state.dragOffset};

                    let selectedMapNodes = this.nodeListView.getSelectedNodes();

                    for (const mapNode of selectedMapNodes) {
                        let $node = this.findMapNodeElement(mapNode);

                        this.uiNodeFactory.moveNodeBy($node, movedBy.x, movedBy.y);
                    }

                    this.propertyListView.fillFromMapNodes(selectedMapNodes);
                    this.setLevelDirty();
                }
            },
        });
    }

    getNodeFromEvent(e) {
        let $selectionBox = $(e.target);

        if (!$selectionBox.is('.selection-box')) {
            return null;
        }

        return $selectionBox.closest('.map-node-root');
    }

    loadLevel(filename) {
        let mapXml = this.context.loadXml(filename);
        let map = this.reader.readLevel(mapXml);

        this.map = map;
        this.currentLevelFilename = filename;

        this.nodeListView.clearNodes();
        this.triggerListView.clearTriggers();

        this.levelListView.setSelectedFile(filename);
        this.mapOptionsView.fillFromMap(map);
        this.randomizerListView.fillFromMap(map);

        this.$mapNodeList.empty();

        this.setTerrain(map.terrain);
        this.paletteView.setSelectedType('terrain', map.terrain.name);

        this.setMapSize(map.width, map.height);
        this.setFowClearColor(map.options.fowClearColor);

        let allTagNames = this.context.getAllTagNames();

        for (const tagName of allTagNames) {
            let mapNodes = map.getNodesOfType(tagName);

            for (let mapNode of mapNodes) {
                let $node;

                if (this.context.isMarkerNode(tagName)) {
                    $node = this.uiNodeFactory.createMarkerNode(tagName, mapNode.type, mapNode);
                } else {
                    $node = this.uiNodeFactory.createNode(tagName, mapNode.type, mapNode);
                }

                this.$mapNodeList.append($node);
                this.nodeListView.addNode(mapNode);
            }
        }

        for (const trigger of map.triggers) {
            this.triggerListView.addTrigger(trigger);
        }

        this.setViewportCenter(map.startX ?? map.playerBaseX, map.startY ?? map.playerBaseY);

        this.setLevelClear();
    }

    addNodeFromBrush() {
        let mapNode = this.$brush.data('map-node');

        this.map.addNode(mapNode);
        this.nodeListView.addNode(mapNode);
        this.releaseBrush();
        this.setBrushFromMapNode(mapNode);
    }

    setBrushFromMapNode(mapNode) {
        this.setBrush(mapNode.tag, mapNode.type, mapNode.name);
    }

    setBrush(tagName, typeName, name) {
        if (this.$brush) {
            this.$brush.remove();
            this.$brush = null;
        }

        if (tagName) {
            this.$brush = this.createBrush(tagName, typeName, name);
            this.$mapNodeList.append(this.$brush);
        }
    }

    hasBrush() {
        return this.$brush !== null;
    }

    clearBrush() {
        this.setBrush(null);
    }

    releaseBrush() {
        this.$brush = null;
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
        this.findMapNodeElement(mapNode).remove();
        this.map.removeNode(mapNode);
        this.nodeListView.removeNode(mapNode);
    }

    mapToXml(map) {
        let writtenMapXml = this.writer.writeLevel(map);

        let xmlSerializer = new XMLSerializer();
        let serializedXml = xmlSerializer.serializeToString(writtenMapXml);

        return reformatXml(serializedXml);
    }

    setAllLayersActive() {
        let allLayerNames = this.context.getLayerTagNames();

        this.setActiveLayers(allLayerNames);
    }

    setActiveLayers(layerNames) {
        let allLayerNames = this.context.getLayerTagNames();

        for (const layerName of allLayerNames) {
            let layerClass = `${layerName}-layer-active`;
            this.$map.toggleClass(layerClass, layerNames.includes(layerName));
        }
    }

    setFowClearColor(color) {
        this.$mainAreaOverlay.toggle(color !== null);
        this.$mainAreaOverlay.css('background-color', color ? colorToCssRgba(color) : null);
    }

    setTerrain(terrain) {
        this.$map.css('background-image', 'none');
        this.$map.css('background-color', 'none');

        if (terrain.texture) {
            this.$map.css('background-image', `url('data${terrain.texture}')`);
        }

        if (terrain.color) {
            this.$map.css('background-color', colorToCssRgba(terrain.color));
        }

        this.$map.css('background-size', `${terrain.width}px ${terrain.height}px`);
    }

    setMapSize(width, height) {
        this.setMapWidth(width);
        this.setMapHeight(height);
    }

    setMapWidth(width) {
        this.$map.css('width', width + 'px');
        $(window).resize();
    }

    setMapHeight(height) {
        this.$map.css('height', height + 'px');
        $(window).resize();
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

    setViewportCenter(x, y) {
        let viewportWidth = this.$mapScroll.width();
        let viewportHeight = this.$mapScroll.height();

        this.$mapScroll.scrollLeft(x - viewportWidth / 2 + this.mapScrollPadding);
        this.$mapScroll.scrollTop(y - viewportHeight / 2 + this.mapScrollPadding);
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