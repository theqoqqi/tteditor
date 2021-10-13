import MapReader from './MapReader.js';
import MapNode from './map/MapNode.js';
import MapWriter from './MapWriter.js';
import Hotkeys from './util/Hotkeys.js';
import TriggerListComponent from './components/sidebars/tabs/TriggerListComponent.js';
import TriggerEditorComponent from './components/sidebars/tabs/TriggerEditorComponent.js';
import MapOptionsComponent from './components/sidebars/tabs/MapOptionsComponent.js';
import RandomizerListComponent from './components/sidebars/tabs/RandomizerListComponent.js';
import LevelListComponent from './components/sidebars/tabs/LevelListComponent.js';
import PaletteComponent from './components/sidebars/tabs/PaletteComponent.js';
import NodeListComponent from './components/sidebars/tabs/NodeListComponent.js';
import PropertyListComponent from './components/sidebars/tabs/PropertyListComponent.js';
import ToolbarComponent from './components/ToolbarComponent.js';
import StatusBarComponent from './components/StatusBarComponent.js';
import MapComponent from './components/MapComponent.js';
import HoveredMapNodesContextMenuComponent from './components/menus/HoveredMapNodesContextMenuComponent.js';
import MapNodeContextMenuComponent from './components/menus/MapNodeContextMenuComponent.js';
import LeftSidebarComponent from './components/sidebars/LeftSidebarComponent.js';
import RightSidebarComponent from './components/sidebars/RightSidebarComponent.js';
import CompositeObserver from './util/CompositeObserver.js';
import LayerListComponent from './components/sidebars/tabs/LayerListComponent.js';

// noinspection CssInvalidHtmlTagReference
export default class MapEditor {

    constructor(context) {
        this.context = context;
        this.uiNodeFactory = context.getUiNodeFactory();

        this.reader = new MapReader(context);
        this.writer = new MapWriter(context);

        this.mapComponent = new MapComponent(this);

        this.toolbarComponent = new ToolbarComponent(this);
        this.statusBarComponent = new StatusBarComponent(this);

        this.leftSidebarComponent = new LeftSidebarComponent(this);
        this.rightSidebarComponent = new RightSidebarComponent(this);

        this.layerListComponent = new LayerListComponent(this);

        this.levelListComponent = new LevelListComponent(this);
        this.paletteComponent = new PaletteComponent(this);
        this.nodeListComponent = new NodeListComponent(this);
        this.propertyListComponent = new PropertyListComponent(this);
        this.triggerListComponent = new TriggerListComponent(this);
        this.triggerEditorComponent = new TriggerEditorComponent(this);
        this.mapOptionsComponent = new MapOptionsComponent(this);
        this.randomizerListComponent = new RandomizerListComponent(this);

        this.mapNodeContextMenuComponent = new MapNodeContextMenuComponent(this);
        this.hoveredMapNodesContextMenuComponent = new HoveredMapNodesContextMenuComponent(this);

        this.$brush = null;

        this.$mainAreaContainer = $('.main-area-container');
        this.$mainAreaOverlay = $('.main-area-overlay');

        this.map = null;
        this.currentLevelFilename = null;

        this.bindListeners();
        this.createObservers();
        this.mapComponent.setAllLayersActive();
        this.reloadDataFromServer();
    }

    reloadDataFromServer() {
        let workspacePath = this.context.getWorkspacePath();

        this.statusBarComponent.setWorkspacePath(workspacePath);

        if (!workspacePath) {
            return;
        }

        let levelList = this.context.loadLevelList();

        this.levelListComponent.setLevelList(levelList);
    }

    bindListeners() {
        Hotkeys.bindGlobal('Control+S', () => {
            this.saveCurrentLevel();
        });

        Hotkeys.bindGlobal('Control+A', () => {
            let visibleNodes = this.nodeListComponent.getVisibleNodes();

            this.nodeListComponent.setSelectedNodes(visibleNodes);
        });

        Hotkeys.bindGlobal('Delete', () => {
            let selectedMapNodes = this.getSelectedNodes();

            for (const mapNode of selectedMapNodes) {
                this.removeNode(mapNode);
                this.setLevelDirty();
            }
        });

        Hotkeys.bindGlobal('Escape', () => {
            if (this.hasBrush()) {
                this.paletteComponent.clearSelectedType();
                this.clearBrush(null);
            }
        });
    }

    createObservers() {
        let valueChangeObserver = (newValue, oldValue) => {
            if (newValue !== oldValue) {
                this.setLevelDirty();
            }
        };

        let listUpdateObserver = item => {
            this.setLevelDirty();
        };



        this.mapObservers = new CompositeObserver();

        this.mapObservers.addPropertyObserver('options', valueChangeObserver);
        this.mapObservers.addPropertyObserver('terrain', valueChangeObserver);
        this.mapObservers.addPropertyObserver('width', valueChangeObserver);
        this.mapObservers.addPropertyObserver('height', valueChangeObserver);
        this.mapObservers.addPropertyObserver('startX', valueChangeObserver);
        this.mapObservers.addPropertyObserver('startY', valueChangeObserver);
        this.mapObservers.addPropertyObserver('playerBaseX', valueChangeObserver);
        this.mapObservers.addPropertyObserver('playerBaseY', valueChangeObserver);
        this.mapObservers.addPropertyObserver('nodes', valueChangeObserver);
        this.mapObservers.addPropertyObserver('triggers', valueChangeObserver);
        this.mapObservers.addListObserver('nodes', listUpdateObserver);
        this.mapObservers.addListObserver('triggers', listUpdateObserver);

        this.mapObservers.addPropertyObserver('options.id', valueChangeObserver);
        this.mapObservers.addPropertyObserver('options.music', valueChangeObserver);
        this.mapObservers.addPropertyObserver('options.coloring', valueChangeObserver);
        this.mapObservers.addPropertyObserver('options.fowClearColor', valueChangeObserver);
        this.mapObservers.addPropertyObserver('options.randomizers', valueChangeObserver);
        this.mapObservers.addListObserver('options.randomizers', listUpdateObserver);



        this.mapNodeObservers = new CompositeObserver();

        this.mapNodeObservers.addPropertyObserver('x', valueChangeObserver);
        this.mapNodeObservers.addPropertyObserver('y', valueChangeObserver);
        this.mapNodeObservers.addPropertyObserver('radius', valueChangeObserver);
        this.mapNodeObservers.addPropertyObserver('name', valueChangeObserver);
        this.mapNodeObservers.addPropertyObserver('hint', valueChangeObserver);
        this.mapNodeObservers.addPropertyObserver('owner', valueChangeObserver);
        this.mapNodeObservers.addPropertyObserver('subId', valueChangeObserver);
        this.mapNodeObservers.addPropertyObserver('group', valueChangeObserver);



        this.randomizerObservers = new CompositeObserver();

        this.randomizerObservers.addPropertyObserver('item', valueChangeObserver);
        this.randomizerObservers.addPropertyObserver('count', valueChangeObserver);



        this.triggerObservers = new CompositeObserver();

        this.triggerObservers.addPropertyObserver('title', valueChangeObserver);
        this.triggerObservers.addPropertyObserver('repeat', valueChangeObserver);
        this.triggerObservers.addPropertyObserver('statements', valueChangeObserver);
        this.triggerObservers.addListObserver('statements', listUpdateObserver);



        let addAttachDetachObservers = (propertyName, propertyObserver, attachableObserver) => {
            propertyObserver.addPropertyObserver(propertyName, (items, oldItems) => {
                for (const item of oldItems ?? []) {
                    attachableObserver.detachFrom(item);
                }
                for (const item of items ?? []) {
                    attachableObserver.attachTo(item);
                }
            });

            propertyObserver.addElementAddedObserver(propertyName, item => {
                attachableObserver.attachTo(item);
            });

            propertyObserver.addElementRemovedObserver(propertyName, item => {
                attachableObserver.detachFrom(item);
            });
        };

        addAttachDetachObservers('nodes', this.mapObservers, this.mapNodeObservers);
        addAttachDetachObservers('triggers', this.mapObservers, this.triggerObservers);
        addAttachDetachObservers('options.randomizers', this.mapObservers, this.randomizerObservers);
    }

    handleMapNodeClick(mapNode, e) {
        let hotkeys = Hotkeys.from(e);

        if (mapNode && hotkeys.matches('Shift')) {
            this.nodeListComponent.addNodeToSelection(mapNode);
            this.hoveredMapNodesContextMenuComponent.setMapNodeSelected(mapNode, true);
        }

        if (mapNode && hotkeys.matches('Control')) {
            this.nodeListComponent.removeNodeFromSelection(mapNode);
            this.hoveredMapNodesContextMenuComponent.setMapNodeSelected(mapNode, false);
        }

        if (hotkeys.isNoModifiersPressed) {
            this.nodeListComponent.setSelectedNodes(mapNode ? [mapNode] : []);
        }
    }

    getMapNodesUnderPosition(x, y) {
        let elements = document.elementsFromPoint(x, y);
        let $selectionBoxes = $(elements).filter('.selection-box');

        return $selectionBoxes
            .map((index, element) => {
                let $node = $(element).closest('.map-node-root');

                return $node.data('map-node');
            })
            .get();
    }

    resetCurrentLevel() {
        let filename = this.levelListComponent.getSelectedFile();

        this.loadLevel(filename);
    }

    saveCurrentLevel() {
        let filename = this.levelListComponent.getSelectedFile();
        let levelXml = this.mapToXml(this.map);

        this.context.saveLevel(filename, levelXml);
        this.setLevelClear();
    }

    downloadCurrentLevel() {
        let fullPath = this.levelListComponent.getSelectedFile();
        let filename = fullPath.split(/\//g).pop();
        let levelXml = this.mapToXml(this.map);

        downloadXml(filename, levelXml);

        this.showModal('alert', {
            message: `В игре файл должен храниться здесь:\nИГРА/${fullPath}`,
        });
    }

    setMapPropertyValue(propertyName, value) {
        let source = this.mapOptionsComponent.getPropertySource(propertyName);
        let propertyHolder = source === 'map' ? this.map : this.map.options;

        propertyHolder[propertyName] = value;
    }

    setMapNodePropertyValue(mapNode, propertyName, value) {
        let numericProperties = ['x', 'y', 'radius'];

        if (numericProperties.includes(propertyName)) {
            mapNode[propertyName] = +value;

        } else {
            mapNode[propertyName] = value;
        }
    }

    loadLevel(filename) {
        let mapXml = this.context.loadXml(filename);
        let map = this.reader.readLevel(mapXml);

        if (this.map) {
            this.mapObservers.detachFrom(this.map);
        }

        this.map = map;

        if (map) {
            this.mapObservers.attachTo(map);
            this.mapObservers.triggerForAll();
        }

        this.currentLevelFilename = filename;

        this.triggerListComponent.clearTriggers();

        this.levelListComponent.setSelectedFile(filename);
        this.nodeListComponent.setMap(map);
        this.mapOptionsComponent.setMap(map);
        this.randomizerListComponent.setMap(map);

        this.paletteComponent.setSelectedType('terrain', map.terrain.name);

        for (const trigger of map.triggers) {
            this.triggerListComponent.addTrigger(trigger);
        }

        this.mapComponent.setMap(map);
        this.mapComponent.setViewportCenter(map.startX ?? map.playerBaseX, map.startY ?? map.playerBaseY);

        this.setLevelClear();
    }

    addNodeFromBrush() {
        let brushMapNode = this.$brush.data('map-node');
        let mapNode = brushMapNode.clone();

        this.viewportPositionToMapPosition(mapNode);

        this.map.addNode(mapNode);
    }

    setBrushPositionOnMap(x, y) {
        let brushMapNode = this.$brush.data('map-node');

        this.setMapNodePosition(brushMapNode, x, y);
        this.mapPositionToViewportPosition(brushMapNode);

        this.uiNodeFactory.setNodeProperty(this.$brush, 'x', brushMapNode.x);
        this.uiNodeFactory.setNodeProperty(this.$brush, 'y', brushMapNode.y);
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
                mapNode.tag = 'chest';
            }

            $node = this.uiNodeFactory.createNode(tagName, typeName, mapNode);
        }

        return $node;
    }

    removeNode(mapNode) {
        this.map.removeNode(mapNode);
    }

    mapToXml(map) {
        let writtenMapXml = this.writer.writeLevel(map);

        let xmlSerializer = new XMLSerializer();
        let serializedXml = xmlSerializer.serializeToString(writtenMapXml);

        return reformatXml(serializedXml);
    }

    isLevelDirty() {
        return this.levelListComponent.isLevelDirty();
    }

    setLevelDirty() {
        this.levelListComponent.setLevelDirty();
    }

    setLevelClear() {
        this.levelListComponent.setLevelClear();
    }

    hasLoadedLevel() {
        return this.currentLevelFilename !== null;
    }

    setMapNodePosition(mapNode, x, y) {
        mapNode.x = x;
        mapNode.y = y;

        if (this.context.shouldAlignToGrid(mapNode)) {
            this.context.alignNodeToGrid(mapNode);
        }
    }

    mapPositionToViewportPosition(mapNode) {
        let viewportPosition = this.mapComponent.getViewportPosition();

        mapNode.x -= viewportPosition.x;
        mapNode.y -= viewportPosition.y;
    }

    viewportPositionToMapPosition(mapNode) {
        let viewportPosition = this.mapComponent.getViewportPosition();

        mapNode.x += viewportPosition.x;
        mapNode.y += viewportPosition.y;
    }

    setMousePosition(x, y) {
        this.statusBarComponent.setMousePosition(x, y);
    }

    focusMapNode(mapNode) {
        this.rightSidebarComponent.openNodeListTab(() => {
            this.nodeListComponent.scrollToNode(mapNode);
        });
    }

    showMapNodeContextMenuForPosition(x, y) {
        this.mapNodeContextMenuComponent.showAt(x, y);
    }

    showHoveredMapNodesContextMenuForPosition(x, y) {
        let mapNodesUnderPointer = this.getMapNodesUnderPosition(x, y);
        let selectedMapNodes = this.getSelectedNodes();

        this.hoveredMapNodesContextMenuComponent.setMapNodes(mapNodesUnderPointer);
        this.hoveredMapNodesContextMenuComponent.setSelectedMapNodes(selectedMapNodes);
        this.hoveredMapNodesContextMenuComponent.showAt(x, y);
    }

    addTrigger(trigger) {
        this.map.addTrigger(trigger);
    }

    removeTrigger(trigger) {
        this.map.removeTrigger(trigger);
    }

    setTerrain(terrain) {
        this.map.setTerrain(terrain);
    }

    addRandomizer(randomizer) {
        this.map.options.addRandomizer(randomizer);
    }

    removeRandomizer(randomizer) {
        this.map.options.removeRandomizer(randomizer);
    }

    getSelectedNodes() {
        return this.nodeListComponent.getSelectedNodes();
    }

    setSelectedNodes(mapNodes) {
        this.mapComponent.setSelectedNodes(mapNodes);
        this.propertyListComponent.setMapNodes(mapNodes);
    }

    setViewportCenter(x, y) {
        this.mapComponent.setViewportCenter(x, y);
    }

    setNodeVisible(mapNode, isVisible) {
        this.mapComponent.setNodeVisible(mapNode, isVisible);
    }

    setActiveLayers(layerNames) {
        this.mapComponent.setActiveLayers(layerNames);
        this.nodeListComponent.setActiveLayers(layerNames);
    }

    setTriggerInEditor(trigger) {
        this.triggerEditorComponent.setTrigger(trigger);
    }

    getContext() {
        return this.context;
    }

    getMap() {
        return this.map;
    }

    showModal(modalType, options) {
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