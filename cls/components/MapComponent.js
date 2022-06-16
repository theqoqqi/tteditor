import AbstractComponent from './AbstractComponent.js';
import MapView from '../views/MapView.js';
import Hotkeys from '../util/Hotkeys.js';
import MoveNodesCommand from '../commands/map/MoveNodesCommand.js';

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
            // unused
        });

        this.view.setDragNodesListener((x, y) => {
            let selectedMapNodes = this.editor.getSelectedNodes().slice();
            let command = new MoveNodesCommand(this.editor, selectedMapNodes, x, y);

            this.editor.executeCommand(command);
        });

        this.view.setMoveActionListener((x, y) => {
            let selectedMapNodes = this.editor.getSelectedNodes().slice();
            let moveBy = this.#getMoveByForNodes(selectedMapNodes);
            let command = new MoveNodesCommand(this.editor, selectedMapNodes, moveBy.x * x, moveBy.y * y);

            this.editor.executeCommand(command);
        });
    }

    #getMoveByForNodes(mapNodes) {
        if (mapNodes.length === 0) {
            return 0;
        }

        let gridAlignedNodes = mapNodes.filter(mapNode => this.context.shouldAlignToGrid(mapNode));

        if (gridAlignedNodes.length === 0) {
            return {
                x: 1,
                y: 1,
            };
        }

        return {
            x: this.context.getAlignGridWidth(),
            y: this.context.getAlignGridHeight(),
        };
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