
export default class BrushView {

    constructor(context) {
        this.context = context;
        this.uiNodeFactory = context.getUiNodeFactory();

        this.$brushContainer = $('.brush');
        this.$brush = null;
    }

    setPosition(x, y) {
        this.uiNodeFactory.setNodeProperty(this.$brush, 'x', x);
        this.uiNodeFactory.setNodeProperty(this.$brush, 'y', y);
    }

    hasBrush() {
        return this.$brush !== null;
    }

    clearBrush() {
        this.setBrush(null);
    }

    setBrush(mapNode) {
        if (this.$brush) {
            this.$brush.remove();
            this.$brush = null;
        }

        if (mapNode) {
            this.$brush = this.#createBrush(mapNode);
            this.$brushContainer.append(this.$brush);
        }
    }

    #createBrush(mapNode) {
        let $node;

        if (this.context.isMarkerNode(mapNode.tag)) {
            $node = this.uiNodeFactory.createMarkerNode(mapNode.tag, mapNode.type, mapNode);
        } else {
            $node = this.uiNodeFactory.createNode(mapNode.tag, mapNode.type, mapNode);
        }

        return $node;
    }
}