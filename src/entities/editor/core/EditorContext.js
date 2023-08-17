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

    loadedXmlFiles = {};

    nodeTagToConfigNameMap = {
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

    nodeTagToConfigTagNameMap = {
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

    constructor(serverUrl) {
        this.serverUrl = serverUrl;
        this.currentAudio = null;

        this.reader = new MapReader(this);
        this.writer = new MapWriter(this);
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

    createMapNode(x, y, tagName, typeName, name, isFake) {
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

    createMapNodeFromElement(element) {
        return this.reader.createNodeFromElement(element);
    }

    getPaletteItemList(tagName) {
        let items = this.palette.querySelectorAll(tagName);

        return Array.from(items).map(item => item.getAttribute('name'));
    }

    setImageSizes(imageSizes) {
        this.imageSizes = imageSizes;
    }

    getImageSize(imagePath) {
        imagePath = this.normalizeDataPath(imagePath);
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

        let normalizedPath = this.normalizeDataPath(path);

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
        let configTagName = this.getConfigTagNameByTagName(tagName);
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
        let configName = this.getConfigNameByTagName(tagName);

        return this.getConfigByName(configName);
    }

    getConfigByName(configName) {
        return this.configsByNames[configName];
    }

    getConfigNameByTagName(tagName) {
        return this.nodeTagToConfigNameMap[tagName];
    }

    getConfigTagNameByTagName(tagName) {
        return this.nodeTagToConfigTagNameMap[tagName];
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

    getElementByXpath(dom, path) {
        return dom.evaluate(path, dom, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
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

        let result = this.getElementByXpath(this.locale, path.replace(/[$.]/g, '/'));

        return result ? result.textContent.replace(/#{!0x\w{8}}/g, '') : (defaultValue ?? path);
    }

    isSimpleNode(tagName) {
        return this.getSimpleTagNames().includes(tagName);
    }

    isMarkerNode(tagName) {
        return this.getMarkerTagNames().includes(tagName);
    }

    getSimpleTagNames() {
        return [
            'landmark',
            'building',
            'structure',
            'unit',
            'item',
            'chest',
        ];
    }

    getMarkerTagNames() {
        return [
            'area',
            'magic',
            'ambient',
            'waypoint',
        ];
    }

    getAllTagNames() {
        let simpleTagNames = this.getSimpleTagNames();
        let markerTagNames = this.getMarkerTagNames();

        return [...simpleTagNames.concat(markerTagNames)];
    }

    getLayerTagNames() {
        let allTagNames = [...this.getAllTagNames()];

        allTagNames.unshift('terrain');

        return allTagNames.filter(tagName => tagName !== 'chest');
    }

    setWorkspacePath(workspacePath) {
        this.workspacePath = workspacePath;
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
        this.loadedXmlFiles[filename] = null;
    }

    async loadXml(filename) {
        filename = this.normalizeDataPath(filename);

        if (this.loadedXmlFiles[filename]) {
            return this.loadedXmlFiles[filename];
        }

        let parser = new DOMParser();
        let responseText = await this.get('files', {
            path: filename,
        });

        this.loadedXmlFiles[filename] = parser.parseFromString(responseText, 'text/xml');

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

    normalizeDataPath(path) {
        if (!path) {
            return '';
        }

        if (!path.startsWith('data')) {
            path = 'data' + path;
        }

        return path;
    }
}