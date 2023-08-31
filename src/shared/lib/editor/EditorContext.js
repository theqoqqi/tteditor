import MapTerrain from './map/MapTerrain.js';
import MapNode from './map/MapNode.js';
import {getNumericContent, getTextContent, reformatXml} from './util/xml.js';
import {hexIntColorToColor} from './util/colors.js';
import MapReader from './MapReader.js';
import MapWriter from './MapWriter.js';

// noinspection CssInvalidHtmlTagReference
export default class EditorContext {

    serverUrl = null;

    workspacePath = null;

    imageSizes = null;

    locale = null;

    palette = null;

    loadingXmlFiles = {};

    loadedXmlFiles = {};

    static nodeTagToConfigNameMap = {
        terrain: 'terrain',
        landmark: 'landmark',
        structure: 'structure',
        building: 'building',
        unit: 'unit',
        magic: 'magic',
        ambient: 'magic',
        item: 'item',
        chest: 'item',
        composition: 'composed',
    };

    static nodeTagToConfigTagNameMap = {
        terrain: 'terrain',
        landmark: 'landmark',
        structure: 'structure',
        building: 'building',
        unit: 'unit',
        magic: 'magic',
        ambient: 'ambient',
        item: 'item',
        chest: 'item',
        composition: 'composition',
    };

    static nodeTagToLayerNameMap = {
        terrain: 'terrain',
        landmark: 'landmark',
        building: 'building',
        structure: 'structure',
        unit: 'unit',
        item: 'item',
        chest: 'item',
        magic: 'magic',
        ambient: 'ambient',
        area: 'area',
        waypoint: 'waypoint',
    };

    constructor(serverUrl) {
        this.serverUrl = serverUrl;
        this.currentAudio = null;

        this.reader = new MapReader(this);
        this.writer = new MapWriter();
    }

    async reloadDataFromServer() {
        if (!this.workspacePath) {
            return;
        }

        let start = Date.now();

        await this.reloadConfigs();
        await this.reloadImageSizes();

        let end = Date.now();

        console.log('Data loading finished in', end - start, 'ms');
    }

    async reloadConfigs() {
        this.locale = await this.loadXml('data/language/Russian-1251.xml');
        this.palette = await this.loadXml('data/cfg/palette.xml');
        this.gameLogic = await this.loadXml('data/cfg/gamelogic.cfg.xml');

        this.configsByNames = {
            terrain: await this.loadXml('data/cfg/terrain.xml'),
            landmark: await this.loadXml('data/cfg/landmark.xml'),
            structure: await this.loadXml('data/cfg/structure.xml'),
            building: await this.loadXml('data/cfg/building.xml'),
            unit: await this.loadXml('data/cfg/unit.xml'),
            magic: await this.loadXml('data/cfg/magic.xml'),
            item: await this.loadXml('data/cfg/item.xml'),
            composed: await this.loadXml('data/cfg/composed.xml'),
        };
    }

    async reloadImageSizes() {
        let responseText = await this.get('images');

        let imageSizes = JSON.parse(responseText);

        this.setImageSizes(imageSizes);
    }

    async createTerrainByName(terrainName) {
        let terrain = new MapTerrain(terrainName);
        let terrainXml = await this.getNodeXmlByName('terrain', terrainName);

        terrain.width = getNumericContent(terrainXml, 'width');
        terrain.height = getNumericContent(terrainXml, 'height');
        terrain.texture = null;
        terrain.color = null;

        if (terrainXml.querySelector('texture')) {
            terrain.texture = getTextContent(terrainXml, 'texture');
        }

        if (terrainXml.querySelector('color')) {
            let color = getTextContent(terrainXml, 'mesh > color');

            terrain.color = hexIntColorToColor(color);
        }

        return terrain;
    }

    static createMapNode(x, y, tagName, typeName, name, isFake) {
        let mapNode = new MapNode(tagName, x, y, isFake);

        mapNode.type = typeName;
        mapNode.name = name;

        if (tagName === 'area') {
            mapNode.radius = 128;
        }

        if (tagName === 'item' && typeName === 'Chest') {
            mapNode.tag = 'chest';
        }

        return mapNode;
    }

    static createMapNodeFromElement(element) {
        return MapReader.createNodeFromElement(element);
    }

    getPaletteItemList(tagName) {
        let items = this.palette.querySelectorAll(tagName);

        return Array.from(items).map(item => item.getAttribute('name'));
    }

    setImageSizes(imageSizes) {
        this.imageSizes = imageSizes;
    }

    getImageSize(imagePath) {
        imagePath = EditorContext.#normalizeDataPath(imagePath);
        return this.imageSizes[imagePath.toLowerCase()];
    }

    async playSoundFor(tagName, typeName) {
        let randomSound = await this.getSoundFor(tagName, typeName);

        this.playSound(randomSound);
    }

    playSound(path) {
        if (this.currentAudio) {
            this.currentAudio.pause();
        }

        let normalizedPath = EditorContext.#normalizeDataPath(path);

        this.currentAudio = new Audio(`${this.workspacePath}/${normalizedPath}`);
        this.currentAudio.play();
    }

    async getSoundFor(tagName, typeName) {
        let nodeMetadata = this.getNodeMetadataByName(tagName, typeName);
        let effectPath = getTextContent(nodeMetadata, 'effect');
        let effect = await this.loadXml(effectPath);
        let sounds = effect.querySelectorAll('node > prototype > sound');

        if (!sounds.length) {
            let playlistPath = getTextContent(effect, 'node > prototype > playlist');

            if (playlistPath) {
                let playlist = await this.loadXml(playlistPath);
                sounds = playlist.querySelectorAll('sound');
            }
        }

        let randomIndex = Math.floor(Math.random() * sounds.length);

        return sounds[randomIndex]?.textContent;
    }

    async getNodeXmlByName(tagName, typeName) {
        let nodeMetadata = this.getNodeMetadataByName(tagName, typeName);

        return await this.getNodeXml(nodeMetadata);
    }

    getNodeMetadataByName(tagName, typeName) {
        let configTagName = EditorContext.getConfigTagNameByTagName(tagName);
        let nodeList = this.getConfigByTagName(tagName);

        if (!nodeList) {
            return null;
        }

        return nodeList.querySelector(`${configTagName}[name='${typeName}']`);
    }

    shouldMapNodeAlignToGrid(mapNode) {
        return this.shouldAlignToGrid(mapNode.tag, mapNode.type);
    }

    shouldAlignToGrid(tagName, typeName) {
        let nodeMetadata = this.getNodeMetadataByName(tagName, typeName);

        if (!nodeMetadata) {
            return false;
        }

        return nodeMetadata.querySelector('grid_align') !== null;
    }

    getMoveStepsForNodes(mapNodes) {
        if (mapNodes.length === 0) {
            return {
                x: 0,
                y: 0,
                aligned: false,
            };
        }

        let gridAlignedNodes = mapNodes.filter(mapNode => this.shouldMapNodeAlignToGrid(mapNode));

        if (gridAlignedNodes.length === 0) {
            return {
                x: 1,
                y: 1,
                aligned: false,
            };
        }

        return {
            x: this.getAlignGridWidth(),
            y: this.getAlignGridHeight(),
            aligned: true,
        };
    }

    alignNodeToGrid(mapNode) {
        let config = this.getGameLogicConfig();
        let gridXml = config.querySelector('grid_grid');
        let gridWidth = +gridXml.getAttribute('x');
        let gridHeight = +gridXml.getAttribute('y');

        mapNode.x = Math.round(mapNode.x / gridWidth) * gridWidth;
        mapNode.y = Math.round(mapNode.y / gridHeight) * gridHeight;
    }

    getAlignGridWidth() {
        let config = this.getGameLogicConfig();
        let gridXml = config.querySelector('grid_grid');

        return +gridXml.getAttribute('x');
    }

    getAlignGridHeight() {
        let config = this.getGameLogicConfig();
        let gridXml = config.querySelector('grid_grid');

        return +gridXml.getAttribute('y');
    }

    getGameLogicConfig() {
        return this.gameLogic;
    }

    getConfigByTagName(tagName) {
        let configName = EditorContext.getConfigNameByTagName(tagName);

        return this.getConfigByName(configName);
    }

    getConfigByName(configName) {
        return this.configsByNames[configName];
    }

    static getConfigNameByTagName(tagName) {
        return EditorContext.nodeTagToConfigNameMap[tagName];
    }

    static getConfigTagNameByTagName(tagName) {
        return EditorContext.nodeTagToConfigTagNameMap[tagName];
    }

    async getNodeXml(nodeMetadata) {
        let nodePath = getTextContent(nodeMetadata, 'node')
            || getTextContent(nodeMetadata, 'animation > node')
            || getTextContent(nodeMetadata, 'structure > node');

        if (!nodePath) {
            return null;
        }

        return await this.loadXml(nodePath);
    }

    getLocalizedHint(hintPath, defaultValue = null) {
        if (!hintPath) {
            return defaultValue;
        }

        if (!hintPath?.startsWith('$hierarchy')) {
            hintPath = '$hierarchy.Hint.' + hintPath;
        }

        return this.getLocalizedString(hintPath, defaultValue);
    }

    getLocalizedString(path, defaultValue = null) {
        if (!path) {
            return defaultValue;
        }

        defaultValue ??= path;

        try {
            let result = EditorContext.#getElementByXpath(this.locale, path.replace(/[$.]/g, '/'));

            return result ? result.textContent.replace(/#{!0x\w{8}}/g, '') : defaultValue;
        } catch (e) {
            console.warn('Missing localization string: ' + path);
            return defaultValue;
        }
    }

    static #getElementByXpath(dom, path) {
        return dom.evaluate(path, dom, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    static isSimpleNode(tagName) {
        return EditorContext.getSimpleTagNames().includes(tagName);
    }

    static isMarkerNode(tagName) {
        return EditorContext.getMarkerTagNames().includes(tagName);
    }

    static getSimpleTagNames() {
        return [
            'landmark',
            'building',
            'structure',
            'unit',
            'item',
            'chest',
        ];
    }

    static getMarkerTagNames() {
        return [
            'area',
            'magic',
            'ambient',
            'waypoint',
        ];
    }

    static getAllTagNames() {
        let simpleTagNames = EditorContext.getSimpleTagNames();
        let markerTagNames = EditorContext.getMarkerTagNames();

        return [...simpleTagNames.concat(markerTagNames)];
    }

    static getLayerNameByTagName(tagName) {
        return EditorContext.nodeTagToLayerNameMap[tagName];
    }

    static getLayerTagNames() {
        let layerNames = Object.values(EditorContext.nodeTagToLayerNameMap);

        return layerNames.filter((layerName, index, array) => array.indexOf(layerName) === index);
    }

    async setWorkspacePath(workspacePath) {
        this.workspacePath = workspacePath;

        if (!this.workspacePath) {
            return Promise.reject('Null workspace');
        }

        let responseText = await this.post('workspaces', {
            path: workspacePath,
        });

        return JSON.parse(responseText);
    }

    getWorkspacePath() {
        return this.workspacePath;
    }

    async loadLevelList() {
        let responseText = await this.get('levels');

        return JSON.parse(responseText);
    }

    async loadLevel(filename) {
        let mapXml = await this.loadXml(filename);

        return await this.reader.readLevel(mapXml);
    }

    async saveLevel(filename, map) {
        let responseText = await this.post('files', {
            path: filename,
            contents: this.writeLevel(map),
        });

        console.log(responseText);

        this.forgetFile(filename);
    }

    writeLevel(map) {
        let writtenMapXml = this.writer.writeLevel(map);

        let xmlSerializer = new XMLSerializer();
        let serializedXml = xmlSerializer.serializeToString(writtenMapXml);

        return reformatXml(serializedXml);
    }

    forgetFile(filename) {
        this.loadingXmlFiles[filename] = null;
        this.loadedXmlFiles[filename] = null;
    }

    async loadXml(filename) {
        filename = EditorContext.#normalizeDataPath(filename);

        if (this.loadedXmlFiles[filename]) {
            return this.loadedXmlFiles[filename];
        }

        let parser = new DOMParser();

        if (this.loadingXmlFiles[filename]) {
            let responseText = await this.loadingXmlFiles[filename];

            return parser.parseFromString(responseText, 'text/xml');
        }

        let promise = this.get('files', {
            path: filename,
        });

        this.loadingXmlFiles[filename] = promise;

        let responseText = await promise;

        this.loadedXmlFiles[filename] = parser.parseFromString(responseText, 'text/xml');
        this.loadingXmlFiles[filename] = null;

        return this.loadedXmlFiles[filename];
    }

    async get(url, params = null) {
        return this.executeHttpRequest('GET', url, { params });
    }

    async post(url, data) {
        return this.executeHttpRequest('POST', url, { data });
    }

    async executeHttpRequest(method, url, options = {}) {
        let fetchOptions = {
            method,
            headers: {
                workspace: this.workspacePath,
                'Content-Type': 'application/json',
            },
        };

        if (options.data) {
            fetchOptions.body = JSON.stringify(options.data);
        }

        if (options.params) {
            url += '?' + new URLSearchParams(options.params);
        }

        const request = fetch(this.serverUrl + '/' + url, fetchOptions)
            .then(async function (response) {
                if (response.ok) {
                    return response;
                }

                throw new Error(await response.text());
            });

        const rawResponse = await request;

        return await rawResponse.text();
    }

    static #normalizeDataPath(path) {
        if (!path) {
            return '';
        }

        if (!path.startsWith('data')) {
            path = 'data' + path;
        }

        return path;
    }
}