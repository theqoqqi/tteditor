import AbstractComponent from '../../AbstractComponent.js';
import NodeListView from '../../../views/sidebars/tabs/NodeListView.js';

export default class NodeListComponent extends AbstractComponent {

    constructor(editor) {
        super(editor, NodeListView);
    }

    bindListeners() {
        this.view.setSelectionChangedListener(mapNodes => {
            this.editor.setSelectedNodes(mapNodes);
        });

        this.view.setElementDoubleClickListener(mapNode => {
            this.editor.setViewportCenter(mapNode.x, mapNode.y);
        });

        this.view.setNodeVisibilityChangedListener((mapNode, isVisible) => {
            this.editor.setNodeVisible(mapNode, isVisible);
        });

        this.view.setCenterNodeButtonClickListener(mapNode => {
            this.editor.setViewportCenter(mapNode.x, mapNode.y);
        });

        this.view.setRemoveNodeButtonClickListener(mapNode => {
            this.editor.removeNode(mapNode);
        });
    }

    setMap(map) {
        this.view.setMap(map);
    }

    addNodeToSelection(mapNode) {
        this.view.addNodeToSelection(mapNode);
    }

    removeNodeFromSelection(mapNode) {
        this.view.removeNodeFromSelection(mapNode);
    }

    getVisibleNodes() {
        return this.view.getVisibleNodes();
    }

    scrollToNode(mapNode) {
        this.view.scrollToNode(mapNode);
    }

    setActiveLayers(layerNames) {
        this.view.setActiveLayers(layerNames);
    }

    setSelectedNodes(mapNodes) {
        this.view.setSelectedNodes(mapNodes);
    }

    getSelectedNodes() {
        return this.view.getSelectedNodes();
    }
}