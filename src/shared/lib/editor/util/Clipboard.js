import MapWriter from '../MapWriter.js';
import MapReader from '../MapReader.js';
import {reformatXml} from './xml.js';

export default class Clipboard {

    constructor(clipboardData) {
        this.clipboardData = clipboardData;
        this.xmlSerializer = new XMLSerializer();
        this.domParser = new DOMParser();
        this.mapWriter = new MapWriter();

        this.mapWriter.init();
    }

    writeMapNodes(mapNodes) {
        let serializedXml = mapNodes
            .map(mapNode => this.mapWriter.createElementFromNode(mapNode))
            .map(element => this.xmlSerializer.serializeToString(element))
            .join('\n');

        let formattedXml = reformatXml(serializedXml);

        this.clipboardData.setData('text/plain', formattedXml);
        this.clipboardData.setData('text/xml', formattedXml);
    }

    readMapNodes() {
        let xmlText = this.clipboardData.getData('text/xml');
        let xmlDocument = this.domParser.parseFromString(`<root>${xmlText}</root>`, 'text/xml');
        let mapNodeXmlElements = xmlDocument.querySelectorAll(`:scope > *`);

        return Array.from(mapNodeXmlElements).map(element => {
            return MapReader.createNodeFromElement(element);
        });
    }

    static from(e) {
        return new Clipboard(e.clipboardData ?? e);
    }
}