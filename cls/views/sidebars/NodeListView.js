import ItemListView from '../util/ItemListView.js';
import ItemButtonView from '../util/ItemButtonView.js';

export default class NodeListView {

    constructor(context) {
        this.context = context;
        this.uiNodeFactory = context.getUiNodeFactory();

        this.$nodeList = $('#node-list');
        this.itemListView = new ItemListView(this.$nodeList);

        this.itemListView.setDataItemKey('map-node');
        this.itemListView.setDataIdKey('map-node-id');
        this.itemListView.setItemIdKey('editorId');
        this.itemListView.setListItemFactory(item => this.createListItem(item));
        this.itemListView.setMultipleSelectionEnabled(true);

        this.nodeRepeatingChangedListener = () => {};
        this.nodeActivityChangedListener = () => {};
        this.nodeRemoveButtonClickListener = () => {};

        this.setAllLayersActive();
    }

    setAllLayersActive() {
        let allLayerNames = this.context.getLayerTagNames();

        this.setActiveLayers(allLayerNames);
    }

    setActiveLayers(layerNames) {
        let allLayerNames = this.context.getLayerTagNames();

        for (const layerName of allLayerNames) {
            let layerClass = `${layerName}-layer-active`;
            this.$nodeList.toggleClass(layerClass, layerNames.includes(layerName));
        }
    }

    setSelectionChangedListener(listener) {
        this.itemListView.setSelectionChangedListener(listener);
    }

    setElementDoubleClickListener(listener) {
        this.itemListView.setElementDoubleClickListener(listener);
    }

    setNodeVisibilityChangedListener(listener) {
        this.nodeRepeatingChangedListener = listener;
    }

    setCenterNodeButtonClickListener(listener) {
        this.nodeActivityChangedListener = listener;
    }

    setRemoveNodeButtonClickListener(listener) {
        this.nodeRemoveButtonClickListener = listener;
    }

    addNodeToSelection(mapNode) {
        this.itemListView.addItemToSelection(mapNode);
    }

    removeNodeFromSelection(mapNode) {
        this.itemListView.removeItemFromSelection(mapNode);
    }

    setSelectedNodes(mapNodes) {
        this.itemListView.setSelectedItems(mapNodes);
    }

    isNodeSelected(mapNode) {
        return this.itemListView.isItemSelected(mapNode);
    }

    getSelectedNodes() {
        return this.itemListView.getSelectedItems();
    }

    addNode(mapNode) {
        this.itemListView.addItem(mapNode);
    }

    removeNode(mapNode) {
        this.itemListView.removeItem(mapNode);
    }

    clearNodes() {
        this.itemListView.clearItems();
    }

    scrollToNode(mapNode) {
        this.itemListView.scrollToItem(mapNode);
    }

    getListItem(mapNode) {
        return this.itemListView.getListItem(mapNode);
    }

    getVisibleNodes() {
        return this.$nodeList
            .find(':visible')
            .map((index, node) => {
                return $(node).data('map-node');
            })
            .get();
    }

    createListItem(mapNode) {
        let iconClass = this.uiNodeFactory.getIconClassForTagName(mapNode.tag);
        let order = this.uiNodeFactory.getOrderTagName(mapNode.tag);
        let title = mapNode.type ?? mapNode.name ?? '';

        let $listItem = $(`
            <div class='node-list-item ${mapNode.tag}'>
                <i class='node-icon ${iconClass}'></i>
                <span class='node-tag'>${mapNode.tag}</span>
                <span class='node-title' title='${title}'>${title}</span>
                <span class='node-pos'>${mapNode.x}</span>
                <span class='node-pos'>${mapNode.y}</span>
                <i class='node-button toggle-node-button bi-eye-fill visible'></i>
                <i class='node-button center-node-button bi-plus-circle'></i>
                <i class='node-button remove-node-button bi-x-circle-fill'></i>
            </div>
        `);

        $listItem.attr('data-editor-id', mapNode.editorId);
        $listItem.css('order', order);

        let $toggleButton = $listItem.find('.toggle-node-button');
        let $centerButton = $listItem.find('.center-node-button');
        let $removeButton = $listItem.find('.remove-node-button');

        let repeatButton = new ItemButtonView($toggleButton, {
            $listItem: $listItem,
            item: mapNode,
            isToggle: true,
            enabledClass: 'visible',
            enabledIconClass: 'bi-eye-fill',
            disabledIconClass: 'bi-eye-slash-fill',
        });

        let toggleButton = new ItemButtonView($centerButton, {
            $listItem: $listItem,
            item: mapNode,
        });

        let removeButton = new ItemButtonView($removeButton, {
            $listItem: $listItem,
            item: mapNode,
        });

        repeatButton.setClickListener((item, enabled) => {
            this.nodeRepeatingChangedListener(item, enabled);
        });

        toggleButton.setClickListener((item, enabled) => {
            this.nodeActivityChangedListener(item, enabled);
        });

        removeButton.setClickListener((item) => {
            this.nodeRemoveButtonClickListener(item);
        });

        return $listItem;
    }
}