
// noinspection CssInvalidHtmlTagReference
import MapTerrain from './map/MapTerrain.js';

export default class EditorContext {

    workspacePath = null;

    loadedXmlFiles = {};

    imageSizes = null;

    locale = null;

    palette = null;
    terrains = null;
    landmarks = null;
    structures = null;
    buildings = null;
    units = null;
    magics = null;
    items = null;

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
    };

    constructor() {
        this.loadWorkspacePath();
        this.reloadDataFromServer();
    }

    reloadDataFromServer() {
        if (!this.workspacePath) {
            return;
        }

        this.reloadConfigs();
        this.reloadImageSizes()
    }

    reloadConfigs() {
        this.locale = this.loadXml('data/language/Russian-1251.xml');
        this.palette = this.loadXml('data/cfg/palette.xml');
        this.terrains = this.loadXml('data/cfg/terrain.xml');
        this.landmarks = this.loadXml('data/cfg/landmark.xml');
        this.structures = this.loadXml('data/cfg/structure.xml');
        this.buildings = this.loadXml('data/cfg/building.xml');
        this.units = this.loadXml('data/cfg/unit.xml');
        this.magics = this.loadXml('data/cfg/magic.xml');
        this.items = this.loadXml('data/cfg/item.xml');

        this.configsByNames = {
            terrain: this.terrains,
            landmark: this.landmarks,
            structure: this.structures,
            building: this.buildings,
            unit: this.units,
            magic: this.magics,
            item: this.items,
        };
    }

    reloadImageSizes() {
        let responseText = this.get({
            url: '/load_image_sizes.php',
        });

        let imageSizes = JSON.parse(responseText);

        this.setImageSizes(imageSizes);
    }

    createTerrainByName(terrainName) {
        let terrain = new MapTerrain(terrainName);
        let terrainXml = this.getNodeByName('terrain', terrainName);

        terrain.width = terrainXml.getNumericContentOf('width');
        terrain.height = terrainXml.getNumericContentOf('height');
        terrain.texture = null;
        terrain.color = null;

        if (terrainXml.querySelector('texture')) {
            terrain.texture = terrainXml.getTextContentOf('texture');
        }

        if (terrainXml.querySelector('color')) {
            let color = terrainXml.getTextContentOf('color');

            terrain.color = hexIntColorToColor(color);
        }

        return terrain;
    }

    getPaletteItemList(tagName) {
        let items = this.palette.querySelectorAll(tagName);

        return Array.from(items).map(item => item.getAttribute('name'));
    }

    setImageSizes(imageSizes) {
        this.imageSizes = imageSizes;
    }

    getImageSize(imagePath) {
        return this.imageSizes[imagePath.toLowerCase()];
    }

    getNodeByName(tagName, nodeName) {
        let configTagName = this.getConfigTagNameByTagName(tagName);
        let objectList = this.getConfigByTagName(tagName);

        return this.loadNodeXmlByName(configTagName, objectList, nodeName);
    }

    getNodeXml(path) {
        return this.loadXml('data' + path);
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

    loadNodeXmlByName(configTagName, objectList, typeName) {
        let nodeInfo = objectList.querySelector(`${configTagName}[name='${typeName}']`);
        let nodePath = nodeInfo.getTextContentOf('node');
        return this.loadXml('data' + nodePath);
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

    setWorkspacePath(workspacePath) {
        let responseText = this.post({
            url: '/set_workspace_path.php',
            data: {
                path: workspacePath,
            },
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

    loadWorkspacePath() {
        this.workspacePath = this.get({
            url: '/get_workspace_path.php',
        });
    }

    loadLevelList() {
        let responseText = this.get({
            url: '/load_level_list.php',
        });

        return JSON.parse(responseText);
    }

    saveLevel(filename, levelXml) {
        this.post({
            url: 'save_level.php',
            data: {
                filename: filename,
                level_xml: levelXml,
            },
            success: responseText => {
                console.log(responseText)
            }
        });

        this.forgetFile(filename);
    }

    forgetFile(filename) {
        this.loadedXmlFiles[filename] = null;
    }

    loadXml(filename) {
        if (this.loadedXmlFiles[filename]) {
            return this.loadedXmlFiles[filename];
        }

        let parser = new DOMParser();
        let responseText = this.get({
            url: '/load_xml.php',
            data: {
                relative_path: filename,
            },
        });

        this.loadedXmlFiles[filename] = parser.parseFromString(responseText, 'text/xml');

        return this.loadedXmlFiles[filename];
    }

    get(options) {
        return this.executeHttpRequest('get', options);
    }

    post(options) {
        return this.executeHttpRequest('post', options);
    }

    executeHttpRequest(method, options) {
        let defaultOptions = {
            async: false,
        };

        options = $.extend(defaultOptions, options);

        let resultResponseText = null;
        let success = options.success || (() => {});

        options.success = responseText => {
            resultResponseText = responseText;
            success(responseText);
        };

        $[method](options);

        return resultResponseText;
    }
}