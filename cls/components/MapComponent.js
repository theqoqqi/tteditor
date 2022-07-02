import AbstractComponent from './AbstractComponent.js';
import MapView from '../views/MapView.js';
import Hotkeys from '../util/Hotkeys.js';
import MoveNodesCommand from '../commands/map/MoveNodesCommand.js';
import MapEditor from '../MapEditor.js';
import Clipboard from '../util/Clipboard.js';

export default class MapComponent extends AbstractComponent {

    constructor(editor) {
        super(editor, MapView);

        this.draggedX = 0;
        this.draggedY = 0;
        this.executedDragX = 0;
        this.executedDragY = 0;
        this.dragStep = null;
    }

    bindListeners() {
        this.view.setClickListener((mapNode, e) => {
            let hotkeys = Hotkeys.from(e);

            if (this.editor.isBrushMode()) {
                return;
            }

            if (this.editor.isSelectMode() && hotkeys.matches('Alt')) {
                this.editor.showHoveredMapNodesContextMenuForPosition(e.clientX, e.clientY);
                return;
            }

            if (this.editor.isSelectMode() && !this.editor.hasOpenedContextMenus()) {
                this.editor.handleMapNodeClick(mapNode, e);
            }
        });

        this.view.setLeftClickListener((mapNode, e) => {
            if (!this.editor.isBrushMode()) {
                return;
            }

            if (this.editor.hasBrush()) {
                this.editor.addNodeFromBrush();
            }
        });

        this.view.setRightClickListener((mapNode, e) => {
            if (this.editor.isBrushMode()) {
                this.editor.setPointerMode(MapEditor.POINTER_MODE_SELECT);
                return;
            }

            this.editor.showMapNodeContextMenuForPosition(e.clientX, e.clientY);
        });

        this.view.setDoubleClickListener((mapNode, e) => {
            if (!this.editor.isSelectMode()) {
                return;
            }

            if (!mapNode) {
                return;
            }

            if (Hotkeys.isAnyModifierPressed(e)) {
                return;
            }

            this.editor.focusMapNode(mapNode);
        });

        this.view.setMouseMoveListener((x, y) => {
            if (this.editor.isBrushMode() && this.editor.hasBrush()) {
                this.editor.setBrushPositionOnMap(x, y);
            }

            this.editor.setMousePosition(x, y);
        });

        this.view.setDragNodesStartedListener(() => {
            if (!this.editor.isSelectMode()) {
                return;
            }

            let selectedMapNodes = this.editor.getSelectedNodes();

            this.dragStep = this.#getMoveByForNodes(selectedMapNodes);
            this.draggedX = 0;
            this.draggedY = 0;
            this.executedDragX = 0;
            this.executedDragY = 0;
        });

        this.view.setDragNodesListener((x, y) => {
            if (!this.editor.isSelectMode()) {
                return;
            }

            let selectedMapNodes = this.editor.getSelectedNodes().slice();

            this.draggedX += x;
            this.draggedY += y;

            let alignedDraggedX = Math.round(this.draggedX / this.dragStep.x) * this.dragStep.x;
            let alignedDraggedY = Math.round(this.draggedY / this.dragStep.y) * this.dragStep.y;

            if (alignedDraggedX !== this.executedDragX || alignedDraggedY !== this.executedDragY) {
                let moveByX = alignedDraggedX - this.executedDragX;
                let moveByY = alignedDraggedY - this.executedDragY;
                let command = new MoveNodesCommand(this.editor, selectedMapNodes, moveByX, moveByY);

                this.editor.executeCommand(command);

                this.executedDragX = alignedDraggedX;
                this.executedDragY = alignedDraggedY;
            }
        });

        this.view.setMoveActionListener((x, y) => {
            if (!this.editor.isSelectMode()) {
                return;
            }

            let selectedMapNodes = this.editor.getSelectedNodes().slice();
            let moveBy = this.#getMoveByForNodes(selectedMapNodes);
            let command = new MoveNodesCommand(this.editor, selectedMapNodes, moveBy.x * x, moveBy.y * y);

            this.editor.executeCommand(command);
        });

        document.addEventListener('copy', e => {
            if (!this.view.isFocused()) {
                return;
            }

            e.preventDefault();

            let selectedMapNodes = this.editor.getSelectedNodes();

            Clipboard.from(e).writeMapNodes(selectedMapNodes);
        });

        document.addEventListener('paste', e => {
            if (!this.view.isFocused()) {
                return;
            }

            e.preventDefault();

            let mapNodes = this.centerMapNodes(e);

            this.editor.setPointerMode(MapEditor.POINTER_MODE_BRUSH);
            this.editor.setBrush(mapNodes);
        });
    }

    centerMapNodes(e) {
        let averageFunc = (array, propertyName) => {
            let sum = array.reduce((previous, mapNode) => {
                return previous + mapNode[propertyName];
            }, 0);

            return sum / array.length;
        };

        let mapNodes = Clipboard.from(e).readMapNodes();
        let centerX = averageFunc(mapNodes, 'x');
        let centerY = averageFunc(mapNodes, 'y');

        mapNodes.map(mapNode => {
            mapNode.x -= centerX;
            mapNode.y -= centerY;
        });

        return mapNodes;
    }

    #getMoveByForNodes(mapNodes) {
        if (mapNodes.length === 0) {
            return 0;
        }

        let gridAlignedNodes = mapNodes.filter(mapNode => this.context.shouldMapNodeAlignToGrid(mapNode));

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

    setPointerMode(mode) {
        this.view.setPointerMode(mode);
    }

    setNodeVisible(mapNode, isVisible) {
        this.view.setNodeVisible(mapNode, isVisible);
    }

    setNodeHighlighted(mapNode, isHighlighted) {
        this.view.setNodeHighlighted(mapNode, isHighlighted);
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