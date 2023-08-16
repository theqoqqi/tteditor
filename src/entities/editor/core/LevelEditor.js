import {getProperty} from 'dot-prop';
import Observable from './util/observables/Observable.js';

export class LevelEditor extends Observable {

    map;

    constructor() {
        super();

        this.map = null;
    }

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

    setMap(map) {
        this.map = map;
    }

    getMap() {
        return this.map;
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

    setMapNodePosition(mapNode, x, y) {
        mapNode.x = x;
        mapNode.y = y;
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
}