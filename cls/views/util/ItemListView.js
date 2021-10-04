
export default class ItemListView {

    constructor($list) {
        this.$list = $list;
        this.selectedItems = [];

        this.dataItemKey = 'item';
        this.dataIdKey = null;
        this.itemIdKey = null;
        this.multipleSelectionEnabled = false;

        this.listItemFactory = () => $('<div>');
        this.selectionChangedListener = () => {};

        this.bindListeners();
    }

    bindListeners() {
        this.$list.on('click', '[role="listitem"]', e => {
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
        if (!this.multipleSelectionEnabled) {
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

    toggleItemSelection(item) {
        if (this.isItemSelected(item)) {
            this.removeItemFromSelection(item);
        } else {
            this.addItemToSelection(item);
        }
    }

    addItemToSelection(item) {
        if (!this.multipleSelectionEnabled) {
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
        let selection = this.multipleSelectionEnabled ? this.getSelectedItems() : this.getSelectedItem();

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

    addItem(item) {
        let $listItem = this.createListItem(item);

        this.$list.append($listItem);
    }

    removeItem(item) {
        this.getListItem(item).remove();
    }

    clearItems() {
        this.$list.empty();
    }

    getListItem(item) {
        let filter;

        if (this.dataIdKey && this.itemIdKey) {
            filter = (index, listItem) => {
                return $(listItem).data(this.dataIdKey) === item[this.itemIdKey];
            };
        } else {
            filter = (index, listItem) => {
                return $(listItem).data(this.dataItemKey) === item;
            };
        }

        return this.$list.find('[role="listitem"]').filter(filter);
    }

    scrollToItem(item) {
        let $listItem = this.getListItem(item);
        let itemY = $listItem.offset().top + this.$list.scrollTop();
        let itemHeight = $listItem.height();
        let listHeight = this.$list.height();

        this.$list.scrollTop(itemY + itemHeight / 2 - listHeight / 2);
    }

    setMultipleSelectionEnabled(enabled) {
        this.multipleSelectionEnabled = enabled;
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