import AbstractComponent from './AbstractComponent.js';
import BrushView from '../views/BrushView.js';
import MapNode from '../map/MapNode.js';

export default class BrushComponent extends AbstractComponent {

    constructor(editor) {
        super(editor, BrushView);

        this.mapNode = null;
    }

    bindListeners() {

    }

    hasBrush() {
        return this.mapNode !== null;
    }

    clearBrush() {
        this.mapNode = null;
        this.view.setBrush(null);
    }

    setBrush(tagName, typeName, name) {
        this.mapNode = new MapNode(tagName, -1000, -1000);

        this.mapNode.type = typeName;
        this.mapNode.name = name;

        if (tagName === 'area') {
            this.mapNode.radius = 128;
        }

        if (tagName === 'item' && typeName === 'Chest') {
            this.mapNode.tag = 'chest';
        }

        this.view.setBrush(this.mapNode);
    }

    addNode() {
        let mapNode = this.mapNode.clone();

        this.editor.viewportPositionToMapPosition(mapNode);

        this.editor.addNode(mapNode);
    }

    setPositionOnMap(x, y) {
        this.editor.setMapNodePosition(this.mapNode, x, y);
        this.editor.mapPositionToViewportPosition(this.mapNode);

        this.view.setPosition(this.mapNode.x, this.mapNode.y);
    }
}