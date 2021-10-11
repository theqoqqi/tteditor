import AbstractComponent from '../AbstractComponent.js';
import HoveredMapNodesContextMenuView from '../../views/menus/HoveredMapNodesContextMenuView.js';

export default class HoveredMapNodesContextMenuComponent extends AbstractComponent {

    constructor(editor) {
        super(editor, HoveredMapNodesContextMenuView);
    }

    bindListeners() {
        this.view.setNodeClickListener((mapNode, e) => {
            this.editor.handleMapNodeClick(mapNode, e);
        });
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

    showAt(x, y) {
        this.view.showAt(x, y);
    }
}