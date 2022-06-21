import HoveredMapNodesContextMenuView from '../../views/menus/HoveredMapNodesContextMenuView.js';
import ContextMenuComponent from '../ContextMenuComponent.js';

export default class HoveredMapNodesContextMenuComponent extends ContextMenuComponent {

    constructor(editor) {
        super(editor, HoveredMapNodesContextMenuView);
    }

    bindListeners() {
        this.view.setNodeClickListener((mapNode, e) => {
            this.editor.handleMapNodeClick(mapNode, e);
        });

        this.view.setNodeHoverListeners(
            (mapNode, e) => {
                this.editor.setMapNodeHighlighted(mapNode, true);
            },
            (mapNode, e) => {
                this.editor.setMapNodeHighlighted(mapNode, false);
            }
        );
    }

    setMapNodeSelected(mapNode, isSelected) {
        this.view.setMapNodeSelected(mapNode, isSelected);
    }

    setMapNodes(mapNodes) {
        this.view.setMapNodes(mapNodes);
    }

    setSelectedMapNodes(mapNodes) {
        this.view.setSelectedMapNodes(mapNodes);
    }
}