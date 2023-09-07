import Observable from './util/observables/Observable';

export default class LevelEditor extends Observable {

    map;

    constructor() {
        super();

        this.map = null;
    }

    setMap(map) {
        this.map = map;
    }

    getMap() {
        return this.map;
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