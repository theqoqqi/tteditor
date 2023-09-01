import GameMap from './map/GameMap';
import MapNode from './map/MapNode';
import Trigger from './map/Trigger';
import MapOptions from './map/MapOptions';
import RandomizerOption from './map/RandomizerOption';
import {getNumericContent, getTextContent} from './util/xml';
import {hexIntColorToColor} from './util/colors';
import EditorContext from './EditorContext';

// noinspection CssInvalidHtmlTagReference
export default class MapReader {

    constructor(context) {
        this.context = context;
        this.map = null;
        this.mapXml = null;
    }

    async readLevel(mapXml) {
        this.map = new GameMap();
        this.mapXml = mapXml;

        this.readTriggers();
        this.readOptions();
        this.readSize();
        this.readStartPosition();
        this.readPlayerBasePosition();
        await this.readTerrain();
        this.readMapNodes();

        let map = this.map;

        this.map = null;
        this.mapXml = null;

        return map;
    }

    readTriggers() {
        let triggerElements = this.mapXml.querySelectorAll(':scope > triggers > trigger');

        for (const triggerElement of triggerElements) {
            let trigger = this.createTriggerFromElement(triggerElement);
            this.map.addTrigger(trigger);
        }
    }

    readOptions() {
        let optionsElement = this.mapXml.querySelector('options');
        let options = MapReader.createOptionsFromElement(optionsElement);

        this.map.setOptions(options);
    }

    readSize() {
        let sizeXml = this.mapXml.querySelector(':scope > size');
        let width = +sizeXml.getAttribute('x') || null;
        let height = +sizeXml.getAttribute('y') || null;

        this.map.setSize(width, height);
    }

    readStartPosition() {
        let startXml = this.mapXml.querySelector(':scope > start');
        let startX = +startXml?.getAttribute('x') || null;
        let startY = +startXml?.getAttribute('y') || null;

        this.map.setStartPosition(startX, startY);
    }

    readPlayerBasePosition() {
        let playerBaseXml = this.mapXml.querySelector(':scope > player_base');
        let playerBaseX = +playerBaseXml.getAttribute('x') || null;
        let playerBaseY = +playerBaseXml.getAttribute('y') || null;

        this.map.setPlayerBasePosition(playerBaseX, playerBaseY);
    }

    async readTerrain() {
        let terrainName = getTextContent(this.mapXml, 'terrain');
        let terrain = await this.context.createTerrainByName(terrainName);

        this.map.setTerrain(terrain);
    }

    readMapNodes() {
        let tagNames = EditorContext.getAllTagNames();

        for (const tagName of tagNames) {
            let nodeElements = this.mapXml.querySelectorAll(`:scope > ${tagName}`);
            for (let nodeElement of nodeElements) {
                let node = MapReader.createNodeFromElement(nodeElement);
                this.map.addNode(node);
            }
        }
    }

    static createOptionsFromElement(element) {
        let options = new MapOptions();

        options.id = getNumericContent(element, 'id');
        options.music = getTextContent(element, 'music');
        options.coloring = hexIntColorToColor(getTextContent(element, 'coloring'));
        options.fowClearColor = hexIntColorToColor(getTextContent(element, 'fow_clear_color'));

        let randomizeElements = element.querySelectorAll(':scope > randomize');

        for (const randomizeElement of randomizeElements) {
            let item = randomizeElement.getAttribute('item');
            let count = +randomizeElement.getAttribute('count');
            let randomizer = new RandomizerOption(item, count);

            options.addRandomizer(randomizer);
        }

        return options;
    }

    createTriggerFromElement(element) {
        let title = element.getAttribute('i');
        let trigger = new Trigger(title);
        let repeatString = element.getAttribute('repeat');

        trigger.repeat = ['1', 'true'].includes(repeatString);
        trigger.statements = this.createStatementsFromContent(element.innerHTML);

        return trigger;
    }

    createStatementsFromContent(content) {
        let lines = content.split('\n').filter(line => line.trim().length > 0);

        let commonStart = MapReader.#getCommonStartPart(lines);

        return lines.map(line => {
            return line.slice(commonStart.length);
        });
    }

    static createNodeFromElement(element) {
        let tag = element.tagName;
        let x = +element.getAttribute('x');
        let y = +element.getAttribute('y');
        let node = new MapNode(tag, x, y);

        node.radius = element.getAttribute('radius') ?? null;
        node.type = element.getAttribute('type') ?? null;
        node.name = element.getAttribute('name') ?? null;
        node.hint = element.getAttribute('hint') ?? null;
        node.owner = element.getAttribute('owner') ?? null;
        node.subId = element.getAttribute('sub_id') ?? null;
        node.group = element.getAttribute('group') ?? null;

        return node;
    }

    static #getCommonStartPart(lines) {
        let sortedLines = lines.concat().sort();
        let first = sortedLines[0];
        let last = sortedLines[sortedLines.length - 1];
        let length = first.length;
        let i = 0;

        while (i < length && first.charAt(i) === last.charAt(i) && first.charAt(i).trim() === '') {
            i++;
        }

        return first.substring(0, i);
    }
}