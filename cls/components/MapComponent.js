import AbstractComponent from './AbstractComponent.js';
import MapView from '../views/MapView.js';
import Hotkeys from '../util/Hotkeys.js';

export default class MapComponent extends AbstractComponent {

    constructor(editor) {
        super(editor, MapView);

        this.draggedXSymbol = Symbol('draggedX');
        this.draggedYSymbol = Symbol('draggedY');
    }

    bindListeners() {
        this.view.setClickListener((mapNode, e) => {
            let hotkeys = Hotkeys.from(e);

            if (this.editor.hasBrush()) {
                this.editor.addNodeFromBrush();
                return;
            }

            if (hotkeys.matches('Alt')) {
                this.editor.showHoveredMapNodesContextMenuForPosition(e.clientX, e.clientY);
                return;
            }

            this.editor.handleMapNodeClick(mapNode, e);
        });

        this.view.setRightClickListener((mapNode, e) => {
            this.editor.showMapNodeContextMenuForPosition(e.clientX, e.clientY);
        });

        this.view.setDoubleClickListener((mapNode, e) => {
            if (!mapNode) {
                return;
            }

            if (Hotkeys.isAnyModifierPressed(e)) {
                return;
            }

            this.editor.focusMapNode(mapNode);
        });

        this.view.setMouseMoveListener((x, y) => {
            if (this.editor.hasBrush()) {
                this.editor.setBrushPositionOnMap(x, y);
            }

            this.editor.setMousePosition(x, y);
        });

        this.view.setDragNodesStartedListener(() => {
            let selectedMapNodes = this.editor.getSelectedNodes();

            for (const mapNode of selectedMapNodes) {
                mapNode[this.draggedXSymbol] = mapNode.x;
                mapNode[this.draggedYSymbol] = mapNode.y;
            }
        });

        this.view.setDragNodesListener((x, y) => {
            let selectedMapNodes = this.editor.getSelectedNodes();

            for (const mapNode of selectedMapNodes) {
                mapNode[this.draggedXSymbol] += x;
                mapNode[this.draggedYSymbol] += y;

                this.editor.setMapNodePosition(mapNode, mapNode[this.draggedXSymbol], mapNode[this.draggedYSymbol]);
            }

        });

        this.view.setMoveActionListener((x, y) => {
            let selectedMapNodes = this.editor.getSelectedNodes();

            for (const mapNode of selectedMapNodes) {
                let moveByX = x;
                let moveByY = y;

                if (this.context.shouldAlignToGrid(mapNode)) {
                    moveByX = this.context.getAlignGridWidth() * Math.sign(x);
                    moveByY = this.context.getAlignGridHeight() * Math.sign(y);
                }

                this.editor.setMapNodePosition(mapNode, mapNode.x + moveByX, mapNode.y + moveByY);
            }

        });
    }

    setMap(map) {
        this.view.setMap(map);
    }

    setNodeVisible(mapNode, isVisible) {
        this.view.setNodeVisible(mapNode, isVisible);
    }

    setSelectedNodes(mapNodes) {
        this.view.setSelectedNodes(mapNodes);
    }

    setAllLayersActive() {
        this.view.setAllLayersActive();
    }

    setActiveLayers(layerNames) {
        this.view.setActiveLayers(layerNames);
    }

    getViewportPosition() {
        return this.view.getViewportPosition();
    }

    setViewportCenter(x, y) {
        this.view.setViewportCenter(x, y);
    }
}