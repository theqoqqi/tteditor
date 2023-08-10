import CompositeObserver from '../util/observables/CompositeObserver.js';
import CommandExecutor from '../util/CommandExecutor.js';
import {getProperty} from 'dot-prop';

export default class LevelAccess {

    #mapPropertySources = {
        width: 'map',
        height: 'map',
        startX: 'map',
        startY: 'map',
        playerBaseX: 'map',
        playerBaseY: 'map',

        id: 'map.options',
        music: 'map.options',
        coloring: 'map.options',
        fowClearColor: 'map.options',
        randomizers: 'map.options',
    };

    isDirty;

    constructor() {
        this.commandExecutor = new CommandExecutor();

        this.map = null;

        this.createObservers();
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

    setMap(map) {
        if (this.map) {
            this.mapObservers.detachFrom(this.map);
        }

        this.map = map;

        this.mapObservers.attachTo(map);
        this.mapObservers.triggerForAll();
    }

    setMapPropertyValue(propertyName, value) {
        let propertyHolder = this.#getPropertyHolder(propertyName);

        propertyHolder[propertyName] = value;
    }

    getMapPropertyValue(propertyName) {
        let propertyHolder = this.#getPropertyHolder(propertyName);

        return propertyHolder[propertyName];
    }

    #getPropertyHolder(propertyName) {
        let sourcePath = this.#mapPropertySources[propertyName];

        return getProperty(this, sourcePath);
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

    setLevelDirty() {
        this.isDirty = true;
    }

    setLevelClear() {
        this.isDirty = false;
    }

    setMapNodePosition(mapNode, x, y) {
        mapNode.x = x;
        mapNode.y = y;
    }

    executeCommand(command) {
        command.setup(this);

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

    getMap() {
        return this.map;
    }
}