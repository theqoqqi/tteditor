
import MapNode from './MapNode.js';

// noinspection CssInvalidHtmlTagReference
export default class GameMap {

    constructor(context) {
        this.context = context;

        this.options = null;
        this.terrain = null;

        this.width = null;
        this.height = null;

        this.startX = null;
        this.startY = null;

        this.playerBaseX = null;
        this.playerBaseY = null;

        this.nodes = [];
        this.triggers = [];
    }

    setOptions(options) {
        this.options = options;
    }

    setTerrain(terrain) {
        this.terrain = terrain;
    }

    setSize(width, height) {
        this.width = width;
        this.height = height;
    }

    setStartPosition(x, y) {
        this.startX = x;
        this.startY = y;
    }

    setPlayerBasePosition(x, y) {
        this.playerBaseX = x;
        this.playerBaseY = y;
    }

    addTrigger(trigger) {
        this.triggers.push(trigger);
    }

    removeTrigger(trigger) {
        let index = this.triggers.indexOf(trigger);
        if (index !== -1) {
            this.triggers.splice(index, 1);
        }
    }

    getTriggers() {
        return this.triggers;
    }

    addNode(node) {
        this.nodes.push(node);
    }

    removeNode(node) {
        let index = this.nodes.indexOf(node);
        if (index !== -1) {
            this.nodes.splice(index, 1);
        }
    }

    getAllNodes() {
        return [...this.nodes];
    }

    getNodesOfType(tagName) {
        return this.nodes.filter(n => n.tag === tagName);
    }
}