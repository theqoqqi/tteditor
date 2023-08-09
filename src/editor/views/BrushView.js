import AbstractView from './AbstractView.js';
import CompositeObserver from '../util/observables/CompositeObserver.js';

export default class BrushView extends AbstractView {

    constructor(editor) {
        super(editor);

        this.$brushContainer = $('.brush');
        this.$brushNodes = null;

        this.mapNodes = [];
        this.createMapNodeObservers();
    }

    createMapNodeObservers() {
        this.mapNodeObservers = new CompositeObserver();

        this.addMapNodePropertyObserver('x');
        this.addMapNodePropertyObserver('y');
    }

    addMapNodePropertyObserver(propertyName) {
        this.mapNodeObservers.addPropertyObserver(propertyName, (value, oldValue, mapNode) => {
            let $node = this.findMapNodeElement(mapNode);

            this.uiNodeFactory.setNodeProperty($node, propertyName, value);
        });
    }

    findMapNodeElement(mapNode) {
        return this.$brushContainer.find(`.map-node.map-node-root[data-editor-id='${mapNode.editorId}']`);
    }

    hasBrush() {
        return this.$brushNodes !== null;
    }

    clearBrush() {
        this.setBrush(null);
    }

    setBrush(mapNodes) {
        if (this.$brushNodes) {
            this.$brushNodes.remove();
            this.$brushNodes = null;
            this.mapNodeObservers.detachFrom(...this.mapNodes);
            this.mapNodes = [];
        }

        if (mapNodes) {
            for (const mapNode of mapNodes) {
                let $node = this.#createNode(mapNode);

                this.$brushContainer.append($node);
            }

            this.$brushNodes = this.$brushContainer.children();
            this.mapNodeObservers.attachTo(...mapNodes);
            this.mapNodes = mapNodes;
        }
    }

    #createNode(mapNode) {
        if (this.context.isMarkerNode(mapNode.tag)) {
            return this.uiNodeFactory.createMarkerNode(mapNode.tag, mapNode.type, mapNode);
        }

        return this.uiNodeFactory.createNode(mapNode.tag, mapNode.type, mapNode);
    }
}