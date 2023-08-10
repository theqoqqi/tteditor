import AbstractComponent from './AbstractComponent.js';
import BrushView from '../views/BrushView.js';
import AddNodesCommand from '../commands/map/AddNodesCommand.js';

export default class BrushComponent extends AbstractComponent {

    constructor(editor) {
        super(editor, BrushView);

        this.mapNodes = [];
        this.offsetsByMapNodeIds = new Map();
    }

    hasBrush() {
        return this.mapNodes.length > 0;
    }

    clearBrush() {
        this.mapNodes = [];
        this.view.clearBrush();
    }

    setBrush(mapNodes) {
        this.offsetsByMapNodeIds.clear();

        this.mapNodes = mapNodes.map(mapNode => mapNode.clone());

        for (const mapNode of this.mapNodes) {
            this.offsetsByMapNodeIds.set(mapNode.editorId, {
                x: mapNode.x,
                y: mapNode.y,
            });
        }

        this.view.setBrush(this.mapNodes);
    }

    addNode() {
        let mapNodes = this.mapNodes.map(mapNode => {
            mapNode = mapNode.clone();
            mapNode.isFake = false;

            this.editor.viewportPositionToMapPosition(mapNode);

            return mapNode;
        });

        let command = new AddNodesCommand(mapNodes);

        this.editor.executeCommand(command);
    }

    setPositionOnMap(x, y) {
        for (const mapNode of this.mapNodes) {
            let offset = this.offsetsByMapNodeIds.get(mapNode.editorId);

            this.levelAccess.setMapNodePosition(mapNode, x + offset.x, y + offset.y);
            this.editor.mapPositionToViewportPosition(mapNode);
        }
    }
}