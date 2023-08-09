import ItemListView from '../../util/ItemListView.js';
import ItemButtonView from '../../util/ItemButtonView.js';
import AbstractView from '../../AbstractView.js';
import CompositeObserver from '../../../util/observables/CompositeObserver.js';

export default class NodeListView extends AbstractView {

    #taskQueue = [];

    constructor(editor) {
        super(editor);

        this.$nodeList = $('#node-list');
        this.itemListView = new ItemListView(this.$nodeList);

        this.itemListView.setDataItemKey('map-node');
        this.itemListView.setDataIdKey('map-node-id');
        this.itemListView.setItemIdKey('editorId');
        this.itemListView.setListItemFactory(item => this.createListItem(item));
        this.itemListView.setSelectionMode(ItemListView.SELECTION_MODE_MULTIPLE);

        this.nodeRepeatingChangedListener = () => {};
        this.nodeActivityChangedListener = () => {};
        this.nodeRemoveButtonClickListener = () => {};

        this.createMapObservers();
        this.createMapNodeObservers();

        this.setAllLayersActive();
        this.#tick();
    }

    #tick() {
        if (this.#taskQueue.length) {
            this.$nodeList.hide();

            while (this.#taskQueue.length) {
                let task = this.#taskQueue.shift();

                task();
            }

            this.$nodeList.show();
        }

        requestAnimationFrame(() => this.#tick());
    }

    #runLater(task) {
        this.#taskQueue.push(task);
    }

    createMapObservers() {
        this.mapObservers = new CompositeObserver();

        this.mapObservers.addPropertyObserver('nodes', mapNodes => {
            this.clearNodes();
            for (const mapNode of mapNodes) {
                this.addNode(mapNode);
            }
        });

        this.mapObservers.addElementAddedObserver('nodes', (mapNode, index) => {
            this.addNode(mapNode, index);
        });

        this.mapObservers.addElementRemovedObserver('nodes', mapNode => {
            this.removeNode(mapNode);
        });
    }

    createMapNodeObservers() {
        this.mapNodeObservers = new CompositeObserver();

        this.addMapNodePropertyObserver('x');
        this.addMapNodePropertyObserver('y');
        this.addMapNodePropertyObserver('title');
        this.addMapNodePropertyObserver('name');
    }

    addMapNodePropertyObserver(propertyName) {
        this.mapNodeObservers.addPropertyObserver(propertyName, (value, oldValue, mapNode) => {
            this.#runLater(() => {
                this.setNodeProperty(mapNode, propertyName, value);
            });
        });
    }

    setMap(map) {
        this.mapObservers.setSingleObservable(map);
        this.mapObservers.triggerFor(map);
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

    setNodeProperty(mapNode, propertyName, value) {
        let $listItem = this.getListItem(mapNode);
        let $element = $listItem.find(`[data-property='${propertyName}']`);

        if (propertyName === 'name') {
            $element = $listItem.find(`[data-property='title']`);
        }

        $element.text(value);

        if (propertyName === 'title') {
            $element.attr('title', value);
        }
    }

    addNode(mapNode, index) {
        this.itemListView.addItem(mapNode, index);
        this.mapNodeObservers.attachTo(mapNode);
    }

    removeNode(mapNode) {
        this.itemListView.removeItem(mapNode);
        this.mapNodeObservers.detachFrom(mapNode);
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
                <span class='node-title' title='${title}' data-property='title'>${title}</span>
                <span class='node-pos' data-property='x'>${mapNode.x}</span>
                <span class='node-pos' data-property='y'>${mapNode.y}</span>
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