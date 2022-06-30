import AbstractComponent from './AbstractComponent.js';
import BrushView from '../views/BrushView.js';
import AddNodesCommand from '../commands/map/AddNodesCommand.js';

export default class BrushComponent extends AbstractComponent {

    constructor(editor) {
        super(editor, BrushView);

        this.mapNodes = [];
        this.offsetsByMapNodeEditorIds = new Map();
    }

    hasBrush() {
        return this.mapNodes.length > 0;
    }

    clearBrush() {
        this.mapNodes = [];
        this.view.clearBrush();
    }

    setBrush(mapNodes) {
        this.offsetsByMapNodeEditorIds.clear();

        this.mapNodes = mapNodes.map(mapNode => mapNode.clone());

        for (const mapNode of this.mapNodes) {
            this.offsetsByMapNodeEditorIds.set(mapNode.editorId, {
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

        let command = new AddNodesCommand(this.editor, mapNodes);

        this.editor.executeCommand(command);
    }

    setPositionOnMap(x, y) {
        for (const mapNode of this.mapNodes) {
            let offset = this.offsetsByMapNodeEditorIds.get(mapNode.editorId);

            this.editor.setMapNodePosition(mapNode, x + offset.x, y + offset.y);
            this.editor.mapPositionToViewportPosition(mapNode);
        }
    }
}