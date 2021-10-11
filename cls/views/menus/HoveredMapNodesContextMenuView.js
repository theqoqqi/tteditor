import ContextMenuView from '../util/ContextMenuView.js';
import Hotkeys from '../../util/Hotkeys.js';

export default class HoveredMapNodesContextMenuView extends ContextMenuView {

    constructor(context) {
        super();

        this.context = context;
        this.uiNodeFactory = context.getUiNodeFactory();

        this.clickListener = () => {};
    }

    setNodeClickListener(listener) {
        this.clickListener = listener;
    }

    setMapNodes(mapNodes) {
        this.clearItems();

        for (const mapNode of mapNodes) {
            this.addItem({
                iconClass: this.uiNodeFactory.getIconClassForTagName(mapNode.tag),
                name: `map-node-${mapNode.editorId}`,
                title: `${mapNode.type ?? mapNode.name} #${mapNode.editorId}`,
                clickListener: (item, e) => this.clickListener(mapNode, e),
                data: {
                    mapNode,
                },
            });
        }
    }

    setSelectedMapNodes(mapNodes) {
        this.itemListView.setSelectedItems([]);

        for (const mapNode of mapNodes) {
            let item = this.getItemFromMapNode(mapNode);

            this.itemListView.addItemToSelection(item);
        }
    }

    setMapNodeSelected(mapNode, selected) {
        let item = this.getItemFromMapNode(mapNode);

        this.setItemSelected(item, selected);
    }

    getItemFromMapNode(mapNode) {
        let allItems = this.itemListView.getAllItems();

        return allItems.find(item => item.data.mapNode === mapNode);
    }

    shouldHide(e) {
        return Hotkeys.isNoModifiersPressed(e);
    }
}