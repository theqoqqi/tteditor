
export default class ItemListView {

    static SELECTION_MODE_NONE = Symbol();
    static SELECTION_MODE_SINGLE = Symbol();
    static SELECTION_MODE_MULTIPLE = Symbol();

    constructor($list) {
        this.$list = $list;
        this.$listItemsByItems = new Map();
        this.selectedItems = [];
        this.items = [];

        this.dataItemKey = 'item';
        this.dataIdKey = null;
        this.itemIdKey = null;
        this.selectionMode = ItemListView.SELECTION_MODE_NONE;
        this.handleSelectionAutomatically = true;

        this.listItemFactory = () => $('<div>');
        this.selectionChangedListener = () => {};

        this.bindListeners();
    }

    bindListeners() {
        this.$list.on('click', '[role="listitem"]', e => {
            if (!this.handleSelectionAutomatically) {
                return;
            }

            let $listItem = $(e.currentTarget);
            let item = $listItem.data(this.dataItemKey);

            if (e.shiftKey) {
                this.selectUntil(item);

            } else if (e.ctrlKey) {
                this.toggleItemSelection(item);

            } else {
                this.setSelectedItems([item]);
            }
        });
    }

    updateItems() {
        for (let item of this.getAllItems()) {
            let isVisible = typeof item.visible === 'function'
                ? item.visible() ?? true
                : item.visible ?? true;

            this.setItemVisible(item, isVisible);
        }
    }

    setSelectionChangedListener(listener) {
        this.selectionChangedListener = listener;
    }

    setElementDoubleClickListener(listener) {
        this.$list.on('dblclick', '[role="listitem"]', e => {
            let $listItem = $(e.currentTarget);
            let item = $listItem.data(this.dataItemKey);

            listener(item);
        });
    }

    selectUntil(item) {
        if (this.selectionMode === ItemListView.SELECTION_MODE_NONE) {
            return;
        }

        if (this.selectionMode === ItemListView.SELECTION_MODE_SINGLE) {
            this.setSelectedItem(item);
            return;
        }

        let $fromItem = this.$list.find('[role="listitem"].selected:visible').first();
        let $toItem = this.getListItem(item);

        if ($fromItem.length === 0) {
            $fromItem = this.$list.find('[role="listitem"]:visible').first();
        }

        if ($fromItem.index() > $toItem.index()) {
            let temp = $fromItem;
            $fromItem = $toItem;
            $toItem = temp;
        }

        let $itemsToSelect = $fromItem.nextUntil($toItem).add($fromItem).add($toItem);
        let itemsToSelect = $itemsToSelect.map((index, item) => $(item).data(this.dataItemKey)).get();

        for (const item of itemsToSelect) {
            let index = this.selectedItems.indexOf(item);
            if (index === -1) {
                this.selectedItems.push(item);
            }
        }

        $itemsToSelect.addClass('selected');

        this.triggerSelectionChanged();
    }

    setItemSelected(item, selected) {
        if (this.selectionMode === ItemListView.SELECTION_MODE_NONE) {
            return;
        }

        let currentlySelected = this.isItemSelected(item);

        if (currentlySelected === !!selected) {
            return;
        }

        this.toggleItemSelection(item);
    }

    toggleItemSelection(item) {
        if (this.selectionMode === ItemListView.SELECTION_MODE_NONE) {
            return;
        }

        if (this.isItemSelected(item)) {
            this.removeItemFromSelection(item);
        } else {
            this.addItemToSelection(item);
        }
    }

    addItemToSelection(item) {
        if (this.selectionMode === ItemListView.SELECTION_MODE_NONE) {
            return;
        }

        if (this.selectionMode === ItemListView.SELECTION_MODE_SINGLE) {
            this.setSelectedItem(item);
            return;
        }

        let $listItem = this.getListItem(item);

        if (!$listItem || this.isItemSelected(item)) {
            return;
        }

        this.selectedItems.push(item);
        $listItem.addClass('selected');

        this.triggerSelectionChanged();
    }

    removeItemFromSelection(item) {
        let $listItem = this.getListItem(item);

        if (!$listItem || !this.isItemSelected(item)) {
            return;
        }

        let index = this.selectedItems.indexOf(item);

        this.selectedItems.splice(index, 1);
        $listItem.removeClass('selected');

        this.triggerSelectionChanged();
    }

    setSelectedItem(item) {
        if (this.selectionMode === ItemListView.SELECTION_MODE_NONE) {
            return;
        }

        if (this.selectedItems.length === 1 && this.selectedItems[0] === item) {
            return;
        }

        this.setSelectedItems([item]);
    }

    setSelectedItems(items) {
        this.selectedItems = items;
        this.$list.find('[role="listitem"]').each((index, listItem) => {
            let $listItem = $(listItem);
            let item = $listItem.data(this.dataItemKey);

            $listItem.toggleClass('selected', items.includes(item));
        });

        this.triggerSelectionChanged();
    }

    triggerSelectionChanged() {
        let selection = this.selectionMode === ItemListView.SELECTION_MODE_MULTIPLE
            ? this.getSelectedItems() : this.getSelectedItem();

        this.selectionChangedListener(selection);
    }

    isItemSelected(item) {
        return this.selectedItems.includes(item);
    }

    getSelectedItem() {
        let items = this.getSelectedItems();

        return items.length ? items[0] : null;
    }

    getSelectedItems() {
        return this.selectedItems;
    }

    setItemVisible(item, isVisible) {
        let $listItem = this.getListItem(item);

        $listItem.toggle(isVisible);
    }

    addItem(item, index) {
        let $listItem = this.createListItem(item);

        if (index === undefined || index === -1) {
            this.$list.append($listItem);
        } else if (index === 0) {
            this.$list.prepend($listItem);
        } else {
            let $insertAfter = this.$list.children().eq(index - 1);

            $listItem.insertAfter($insertAfter);
        }

        this.items.splice(index, 0, item);
        this.$listItemsByItems.set(this.getMapKeyFor(item), $listItem);
    }

    removeItem(item) {
        let index = this.items.indexOf(item);

        if (index === -1) {
            return;
        }

        this.getListItem(item).remove();
        this.items.splice(index, 1);
        this.$listItemsByItems.delete(this.getMapKeyFor(item));
    }

    clearItems() {
        this.$list.empty();
        this.items = [];
    }

    getItemFrom($listItem) {
        return $listItem.data(this.dataItemKey);
    }

    getAllItems() {
        return [...this.items];
    }

    getAllListItems() {
        return this.$list.find('[role="listitem"]');
    }

    getListItem(item) {
        return this.$listItemsByItems.get(this.getMapKeyFor(item));
    }

    getMapKeyFor(item) {
        if (this.dataIdKey && this.itemIdKey) {
            return item[this.itemIdKey];
        }

        return item;
    }

    scrollToItem(item) {
        let $listItem = this.getListItem(item);
        let itemY = $listItem.offset().top + this.$list.scrollTop();
        let itemHeight = $listItem.height();
        let listHeight = this.$list.height();

        this.$list.scrollTop(itemY + itemHeight / 2 - listHeight / 2);
    }

    setSelectionMode(selectionMode) {
        this.selectionMode = selectionMode;
    }

    setSelectionHandlerEnabled(enabled) {
        this.handleSelectionAutomatically = enabled;
    }

    setDataItemKey(key) {
        this.dataItemKey = key;
    }

    setDataIdKey(key) {
        this.dataIdKey = key;
    }

    setItemIdKey(key) {
        this.itemIdKey = key;
    }

    setListItemFactory(factory) {
        this.listItemFactory = factory;
    }

    createListItem(item) {
        let $listItem = this.listItemFactory(item);

        $listItem.attr('role', 'listitem');
        $listItem.data(this.dataItemKey, item);

        if (this.dataIdKey && this.itemIdKey) {
            $listItem.data(this.dataIdKey, item[this.itemIdKey]);
        }

        return $listItem;
    }
}