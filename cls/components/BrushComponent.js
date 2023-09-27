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

        let command = new AddNodesCommand(this.editor, mapNodes);

        this.editor.executeCommand(command);
    }

    setPositionOnMap(x, y) {
        let position = { x, y };

        if (this.mapNodes.some(mapNode => this.context.shouldMapNodeAlignToGrid(mapNode))) {
            position = this.context.alignPositionToGrid(x, y);
        }

        this.mapNodes.forEach(mapNode => {
            let offset = this.offsetsByMapNodeIds.get(mapNode.editorId);
            let x = (offset?.x ?? 0) + position.x;
            let y = (offset?.y ?? 0) + position.y;

            this.editor.setMapNodePosition(mapNode, x, y);
            this.editor.mapPositionToViewportPosition(mapNode);
        });
    }
}