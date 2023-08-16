import Observable from '../util/observables/Observable.js';

let nextEditorId = 1;

// noinspection CssInvalidHtmlTagReference
export default class GameMap extends Observable {

    constructor(context) {
        super();

        this.editorId = nextEditorId++;
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

    indexOfTrigger(trigger) {
        return this.triggers.indexOf(trigger);
    }

    insertTrigger(trigger, index) {
        this.triggers.splice(index, 0, trigger);
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

    indexOfNode(node) {
        return this.nodes.indexOf(node);
    }

    insertNode(node, index) {
        this.nodes.splice(index, 0, node);
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

    getNodesOfType(tagName) {
        return this.nodes.filter(n => n.tag === tagName);
    }
}