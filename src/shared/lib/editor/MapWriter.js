// noinspection CssInvalidHtmlTagReference
import {colorToHexIntColor} from './util/colors.js';
import EditorContext from './EditorContext.js';

export default class MapWriter {

    constructor() {
        this.map = null;
        this.parser = null;
        this.mapDocument = null;
        this.mapXmlRoot = null;
    }

    writeLevel(map) {
        this.map = map;
        this.parser = new DOMParser();
        this.mapDocument = document.implementation.createDocument(null, 'level');
        this.mapXmlRoot = this.mapDocument.documentElement;

        this.writeTriggers();
        this.writeOptions();
        this.writeSize();
        this.writeStartPosition();
        this.writePlayerBasePosition();
        this.writeTerrain();
        this.writeMapNodes();

        let mapDocument = this.mapDocument;

        this.map = null;
        this.parser = null;
        this.mapDocument = null;
        this.mapXmlRoot = null;

        return mapDocument;
    }

    init() {
        this.parser = new DOMParser();
        this.mapDocument = document.implementation.createDocument(null, 'level');
        this.mapXmlRoot = this.mapDocument.documentElement;
    }

    writeTriggers() {
        let triggerListElement = this.mapDocument.createElement('triggers');

        for (const trigger of this.map.triggers) {
            let triggerElement = this.createElementFromTrigger(trigger);

            triggerListElement.appendChild(triggerElement);
        }

        this.mapXmlRoot.appendChild(triggerListElement);
    }

    writeOptions() {
        let optionsElement = this.createElementFromOptions(this.map.options);

        this.mapXmlRoot.appendChild(optionsElement);
    }

    writeSize() {
        if (!this.map.width || !this.map.height) {
            return;
        }

        let sizeElement = this.mapDocument.createElement('size');

        sizeElement.setAttribute('x', this.map.width);
        sizeElement.setAttribute('y', this.map.height);

        this.mapXmlRoot.appendChild(sizeElement);
    }

    writeStartPosition() {
        if (!this.map.startX || !this.map.startY) {
            return;
        }

        let startElement = this.mapDocument.createElement('start');

        startElement.setAttribute('x', this.map.startX);
        startElement.setAttribute('y', this.map.startY);

        this.mapXmlRoot.appendChild(startElement);
    }

    writePlayerBasePosition() {
        if (!this.map.playerBaseX || !this.map.playerBaseY) {
            return;
        }

        let playerBaseElement = this.mapDocument.createElement('player_base');

        playerBaseElement.setAttribute('x', this.map.playerBaseX);
        playerBaseElement.setAttribute('y', this.map.playerBaseY);

        this.mapXmlRoot.appendChild(playerBaseElement);
    }

    writeTerrain() {
        let terrainElement = this.createValueElement('terrain', this.map.terrain.name);

        this.mapXmlRoot.appendChild(terrainElement);
    }

    writeMapNodes() {
        let tagNames = EditorContext.getAllTagNames();

        for (const tagName of tagNames) {
            let nodes = this.map.getNodesOfType(tagName);

            for (const node of nodes) {
                let nodeElement = this.createElementFromNode(node);

                this.mapXmlRoot.appendChild(nodeElement);
            }
        }
    }

    createElementFromOptions(options) {
        let optionsElement = this.mapDocument.createElement('options');

        if (options.id) {
            this.addValueElement(optionsElement, 'id', options.id);
        }

        if (options.music) {
            this.addValueElement(optionsElement, 'music', options.music);
        }

        if (options.coloring) {
            let formatted = colorToHexIntColor(options.coloring);

            this.addValueElement(optionsElement, 'coloring', formatted);
        }

        if (options.fowClearColor) {
            let formatted = colorToHexIntColor(options.fowClearColor);

            this.addValueElement(optionsElement, 'fow_clear_color', formatted);
        }

        for (const randomizer of options.randomizers) {
            let randomizerElement = this.createElementFromRandomizer(randomizer);

            optionsElement.appendChild(randomizerElement);
        }

        return optionsElement;
    }

    createElementFromRandomizer(randomizer) {
        let randomizerElement = this.mapDocument.createElement('randomize');

        randomizerElement.setAttribute('count', randomizer.count);
        randomizerElement.setAttribute('item', randomizer.item);

        return randomizerElement;
    }

    createElementFromTrigger(trigger) {
        let statementsString = trigger.statements.join('\n');
        let triggerElement = this.createXmlElementFromString(`<trigger>${statementsString}</trigger>`);

        if (trigger.title) {
            triggerElement.setAttribute('i', trigger.title);
        }

        if (trigger.repeat) {
            triggerElement.setAttribute('repeat', '1');
        }

        return triggerElement;
    }

    createElementFromNode(node) {
        let nodeElement = this.mapDocument.createElement(node.tag);

        if (node.subId) {
            nodeElement.setAttribute('sub_id', node.subId);
        }

        if (node.group) {
            nodeElement.setAttribute('group', node.group);
        }

        if (node.hint) {
            nodeElement.setAttribute('hint', node.hint);
        }

        if (node.name) {
            nodeElement.setAttribute('name', node.name);
        }

        if (node.owner) {
            nodeElement.setAttribute('owner', node.owner);
        }

        if (node.type) {
            nodeElement.setAttribute('type', node.type);
        }

        if (node.radius) {
            nodeElement.setAttribute('radius', node.radius);
        }

        nodeElement.setAttribute('x', node.x);
        nodeElement.setAttribute('y', node.y);

        return nodeElement;
    }

    addValueElement(parentElement, childTagName, value) {
        let child = this.createValueElement(childTagName, value);

        parentElement.appendChild(child);
    }

    createValueElement(tagName, value) {
        let element = this.mapDocument.createElement(tagName);

        element.textContent = value;

        return element;
    }

    createXmlElementFromString(xmlString) {
        return this.parser.parseFromString(xmlString, 'text/xml').documentElement;
    }
}