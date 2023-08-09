import MapReader from './MapReader.js';
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
import BrushComponent from './components/BrushComponent.js';
import CommandExecutor from './util/CommandExecutor.js';
import CommandListComponent from './components/CommandListComponent.js';
import RemoveNodesCommand from './commands/map/RemoveNodesCommand.js';
import DummyCommand from './commands/DummyCommand.js';
import PaletteMapNodeContextMenuComponent from './components/menus/PaletteMapNodeContextMenuComponent.js';
import {downloadXml, reformatXml} from './util/utils.js';

export default class MapEditor {

    static POINTER_MODE_SELECT = Symbol('MapEditor.POINTER_MODE_SELECT');

    static POINTER_MODE_BRUSH = Symbol('MapEditor.POINTER_MODE_BRUSH');

    static POINTER_MODE_SCROLL = Symbol('MapEditor.POINTER_MODE_SCROLL');

    constructor(context) {
        this.context = context;
        this.uiNodeFactory = context.getUiNodeFactory();

        this.reader = new MapReader(context);
        this.writer = new MapWriter(context);

        this.commandExecutor = new CommandExecutor();

        this.mapComponent = new MapComponent(this);

        this.toolbarComponent = new ToolbarComponent(this);
        this.statusBarComponent = new StatusBarComponent(this);

        this.leftSidebarComponent = new LeftSidebarComponent(this);
        this.rightSidebarComponent = new RightSidebarComponent(this);

        this.layerListComponent = new LayerListComponent(this);

        this.levelListComponent = new LevelListComponent(this);
        this.paletteComponent = new PaletteComponent(this);
        this.commandListComponent = new CommandListComponent(this);
        this.nodeListComponent = new NodeListComponent(this);
        this.propertyListComponent = new PropertyListComponent(this);
        this.triggerListComponent = new TriggerListComponent(this);
        this.triggerEditorComponent = new TriggerEditorComponent(this);
        this.mapOptionsComponent = new MapOptionsComponent(this);
        this.randomizerListComponent = new RandomizerListComponent(this);

        this.mapNodeContextMenuComponent = new MapNodeContextMenuComponent(this);
        this.hoveredMapNodesContextMenuComponent = new HoveredMapNodesContextMenuComponent(this);
        this.paletteMapNodeContextMenuComponent = new PaletteMapNodeContextMenuComponent(this);

        this.brushComponent = new BrushComponent(this);

        this.map = null;
        this.currentLevelFilename = null;
        this.pointerMode = null;

        this.bindListeners();
        this.createObservers();
        this.mapComponent.setAllLayersActive();
        this.setPointerMode(MapEditor.POINTER_MODE_SELECT);
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

        Hotkeys.bindGlobal('Control+Z', () => {
            this.undoCommand();
        });

        Hotkeys.bindGlobal('Control+Shift+Z', () => {
            this.redoCommand();
        });

        Hotkeys.bindGlobal('Delete', () => {
            let selectedMapNodes = this.getSelectedNodes();
            let command = new RemoveNodesCommand(this, selectedMapNodes);

            this.executeCommand(command);
        });

        Hotkeys.bindGlobal('Escape', () => {
            if (this.brushComponent.hasBrush()) {
                this.paletteComponent.clearSelectedType();
                this.brushComponent.clearBrush();
            }
        });
    }

    createObservers() {
        let valueChangeObserver = (newValue, oldValue) => {
            if (newValue !== oldValue) {
                this.setLevelDirty();
            }
        };

        let listUpdateObserver = () => {
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
        let $selectionBoxes = this.getSelectionBoxesUnderPosition(x, y);

        return $selectionBoxes
            .map((index, element) => {
                let $node = $(element).closest('.map-node-root');

                return $node.data('map-node');
            })
            .get();
    }

    getTopMapNodeUnderPosition(x, y) {
        let $selectionBoxes = this.getSelectionBoxesUnderPosition(x, y);

        let highestSelectionBox = $selectionBoxes.get().reduce(function(prev, current) {
            if (prev === null || +$(current).css('z-index') > +$(prev).css('z-index')) {
                return current;
            } else {
                return prev;
            }
        }, null);

        if (!highestSelectionBox) {
            return null;
        }

        let $node = $(highestSelectionBox).closest('.map-node-root');

        return $node.data('map-node');
    }

    getSelectionBoxesUnderPosition(x, y) {
        let elements = document.elementsFromPoint(x, y);

        return $(elements).filter('.selection-box');
    }

    setMapNodeHighlighted(mapNode, isHighlighted) {
        this.mapComponent.setNodeHighlighted(mapNode, isHighlighted);
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
        let propertyHolder = this.getPropertyHolder(propertyName);

        propertyHolder[propertyName] = value;
    }

    getMapPropertyValue(propertyName) {
        let propertyHolder = this.getPropertyHolder(propertyName);

        return propertyHolder[propertyName];
    }

    getPropertyHolder(propertyName) {
        let source = this.mapOptionsComponent.getPropertySource(propertyName);

        return source === 'map' ? this.map : this.map.options;
    }

    setMapNodePropertyValue(mapNode, propertyName, value) {
        if (propertyName === 'x') {
            this.setMapNodePosition(mapNode, +value, mapNode.y);
            return;
        }

        if (propertyName === 'y') {
            this.setMapNodePosition(mapNode, mapNode.x, +value);
            return;
        }

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

        this.commandExecutor.clear();
        this.commandListComponent.clearCommands();
        this.triggerListComponent.clearTriggers();

        if (this.map) {
            this.mapObservers.detachFrom(this.map);
        }

        this.map = map;

        this.currentLevelFilename = filename;
        this.levelListComponent.setSelectedFile(filename);

        this.commandListComponent.setCommandExecutor(this.commandExecutor);

        this.nodeListComponent.setMap(map);
        this.mapOptionsComponent.setMap(map);
        this.randomizerListComponent.setMap(map);
        this.triggerListComponent.setMap(map);

        this.paletteComponent.setSelectedType('terrain', map.terrain.name);

        for (const trigger of map.triggers) {
            this.triggerListComponent.addTrigger(trigger);
        }

        this.mapComponent.setMap(map);
        this.mapComponent.setViewportCenter(map.startX ?? map.playerBaseX, map.startY ?? map.playerBaseY);

        this.mapObservers.attachTo(map);
        this.mapObservers.triggerForAll();

        this.setLevelClear();
        this.executeCommand(this.createInitialCommand());
    }

    createInitialCommand() {
        return new DummyCommand(this, 'Изначальное состояние', 'bi-circle');
    }

    setPointerMode(mode) {
        if (this.pointerMode === MapEditor.POINTER_MODE_BRUSH) {
            this.clearBrush();
        }

        this.pointerMode = mode;
        this.mapComponent.setPointerMode(mode);
        this.toolbarComponent.setPointerMode(mode);
    }

    isSelectMode() {
        return this.pointerMode === MapEditor.POINTER_MODE_SELECT;
    }

    isBrushMode() {
        return this.pointerMode === MapEditor.POINTER_MODE_BRUSH;
    }

    isScrollMode() {
        return this.pointerMode === MapEditor.POINTER_MODE_SCROLL;
    }

    addNodeFromBrush() {
        this.brushComponent.addNode();
    }

    setBrushPositionOnMap(x, y) {
        this.brushComponent.setPositionOnMap(x, y);
    }

    hasBrush() {
        return this.brushComponent.hasBrush();
    }

    setBrush(mapNodes) {
        this.brushComponent.setBrush(mapNodes);
    }

    clearBrush() {
        this.brushComponent.clearBrush();
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

        if (this.context.shouldMapNodeAlignToGrid(mapNode)) {
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

    selectLastBrush() {
        this.leftSidebarComponent.openPaletteTab(() => {
            this.paletteComponent.selectLastBrush();
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

    showPaletteMapNodeContextMenuForPosition(x, y, options) {
        this.paletteMapNodeContextMenuComponent.showAt(x, y, options);
    }

    hasOpenedContextMenus() {
        return this.mapNodeContextMenuComponent.isOpened
            || this.hoveredMapNodesContextMenuComponent.isOpened
            || this.paletteMapNodeContextMenuComponent.isOpened;
    }

    executeCommand(command) {
        this.commandExecutor.execute(command);
    }

    undoCommand() {
        this.commandExecutor.undo();
    }

    redoCommand() {
        this.commandExecutor.redo();
    }

    indexOfNode(node) {
        return this.map.indexOfNode(node);
    }

    insertNode(node, index) {
        this.map.insertNode(node, index);
    }

    addNode(mapNode) {
        this.map.addNode(mapNode);
    }

    removeNode(mapNode) {
        this.map.removeNode(mapNode);
    }

    indexOfTrigger(trigger) {
        return this.map.indexOfTrigger(trigger);
    }

    insertTrigger(trigger, index) {
        this.map.insertTrigger(trigger, index);
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

    indexOfRandomizer(randomizer) {
        return this.map.options.indexOfRandomizer(randomizer);
    }

    insertRandomizer(randomizer, index) {
        this.map.options.insertRandomizer(randomizer, index);
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

    createMapNodeFromElement(element) {
        return this.reader.createNodeFromElement(element);
    }

    logMapNode(mapNode) {
        if (!mapNode) {
            console.log('Node is null');
            return;
        }

        let tagName = mapNode.tag;
        let typeName = mapNode.type;
        let node = this.context.getNodeByName(tagName, typeName);
        let nodeInfo = this.context.getNodeInfoByName(tagName, typeName);

        console.log(`Node #${mapNode.editorId} (${tagName}, ${typeName})`, node, nodeInfo);
    }

    logNode(tagName, typeName) {
        let node = this.context.getNodeByName(tagName, typeName);
        let nodeInfo = this.context.getNodeInfoByName(tagName, typeName);

        console.log(`Node (${tagName}, ${typeName})`, node, nodeInfo);
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