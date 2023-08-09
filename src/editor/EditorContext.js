import MapTerrain from './map/MapTerrain.js';
import MapNode from './map/MapNode.js';
import {getNumericContent, getTextContent} from './util/xml.js';
import {hexIntColorToColor} from './util/colors.js';

// noinspection CssInvalidHtmlTagReference
export default class EditorContext {

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

    constructor() {
        this.currentAudio = null;

        this.loadWorkspacePath();
        this.reloadDataFromServer();
    }

    async reloadDataFromServer() {
        if (!this.workspacePath) {
            return;
        }

        let start = Date.now();

        await this.reloadConfigs();
        await this.preloadDataConfigs();
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

    async preloadDataConfigs() {
        let allNodePaths = Object.values(this.configsByNames)
            .flatMap(configXml => Array.from(configXml.querySelectorAll('node, node2')))
            .map(node => node.textContent);

        for (const chunk of this.toChunks(allNodePaths, 10)) {
            await Promise.all(chunk.map(async path => {
                try {
                    await this.loadXml(path);
                } catch (e) {
                    console.error('Failed to preload:', path);
                }
            }));
        }
    }

    toChunks(array, chunkSize) {
        let chunks = [];

        for (let i = 0; i < array.length; i += chunkSize) {
            const chunk = array.slice(i, i + chunkSize);

            chunks.push(chunk);
        }

        return chunks;
    }

    async reloadImageSizes() {
        let responseText = await this.get('/load_image_sizes.php');

        let imageSizes = JSON.parse(responseText);

        this.setImageSizes(imageSizes);
    }

    createTerrainByName(terrainName) {
        let terrain = new MapTerrain(terrainName);
        let terrainXml = this.getNodeByName('terrain', terrainName);

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

        this.playSound(randomSound)
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
        let nodeInfo = this.getNodeInfoByName(tagName, typeName);
        let effectPath = getTextContent(nodeInfo, 'effect');
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

    getNodeByName(tagName, typeName) {
        let nodeInfo = this.getNodeInfoByName(tagName, typeName);

        return this.getNodeXml(nodeInfo);
    }

    getNodeInfoByName(tagName, typeName) {
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
        let node = this.getNodeInfoByName(tagName, typeName);

        if (!node) {
            return false;
        }

        return node.querySelector('grid_align') !== null;
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

    getNodeXml(nodeInfo) {
        let nodePath = getTextContent(nodeInfo, 'node')
            || getTextContent(nodeInfo, 'animation > node')
            || getTextContent(nodeInfo, 'structure > node');

        if (!nodePath) {
            return null;
        }

        return this.getXml(nodePath);
    }

    getElementByXpath(dom, path) {
        return dom.evaluate(path, dom, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    getLocalizedString(path) {
        let result = this.getElementByXpath(this.locale, path.replace(/[$.]/g, '/'));

        return result ? result.textContent.replace(/#{!0x\w{8}}/g, '') : path;
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

    async setWorkspacePath(workspacePath) {
        let responseText = await this.post('/set_workspace_path.php', {
            path: workspacePath,
        });

        let response = JSON.parse(responseText);
        let isOk = response.status === 'OK';

        if (isOk) {
            this.workspacePath = workspacePath;
        }

        return isOk;
    }

    getWorkspacePath() {
        return this.workspacePath;
    }

    async loadWorkspacePath() {
        this.workspacePath = await this.get('/get_workspace_path.php');
    }

    async loadLevelList() {
        let responseText = await this.get('/load_level_list.php');

        return JSON.parse(responseText);
    }

    async saveLevel(filename, levelXml) {
        let responseText = await this.post('save_level.php', {
            filename: filename,
            level_xml: levelXml,
        });

        console.log(responseText)

        this.forgetFile(filename);
    }

    forgetFile(filename) {
        this.loadedXmlFiles[filename] = null;
    }

    getXml(filename) {
        return this.loadedXmlFiles[filename];
    }

    async loadXml(filename) {
        filename = this.normalizeDataPath(filename);

        if (this.loadedXmlFiles[filename]) {
            return this.loadedXmlFiles[filename];
        }

        let parser = new DOMParser();
        let responseText = await this.get('/load_xml.php', {
            relative_path: filename,
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
        };

        if (options.data) {
            fetchOptions.data = JSON.stringify(options.data);
        }

        if (options.params) {
            url += '?' + new URLSearchParams(options.params);
        }

        const rawResponse = await fetch(url, fetchOptions);

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