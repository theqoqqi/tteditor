import ItemListView from './ItemListView.js';

export default class ContextMenuView {

    constructor($menu = null) {
        this.$menu = $menu;

        if ($menu === null) {
            this.$menu = this.createContextMenu();
        }

        this.x = null;
        this.y = null;

        this.itemListView = new ItemListView(this.$menu);
        this.itemListView.setDataItemKey('item');
        this.itemListView.setListItemFactory(item => this.createListItem(item));
        this.itemListView.setSelectionMode(ItemListView.SELECTION_MODE_MULTIPLE);
        this.itemListView.setSelectionHandlerEnabled(false);

        this.bindListeners();
    }

    bindListeners() {
        this.bindItemListener('click', (item, e) => {
            item.clickListener?.(item, e);
        });

        this.bindItemListener('mouseenter', (item, e) => {
            item.mouseEnterListener?.(item, e);
        });

        this.bindItemListener('mouseleave', (item, e) => {
            item.mouseLeaveListener?.(item, e);
        });

        this.$menu.contextmenu(e => false);

        $(window).mouseup(e => {
            if (this.shouldHide(e)) {
                requestAnimationFrame(() => {
                    this.hide();
                });
            }
        });
    }

    bindItemListener(eventName, listener) {
        this.$menu.on(eventName, '.context-menu-item', e => {
            let $listItem = $(e.currentTarget);
            let item = $listItem.data('item');

            listener(item, e);
        });
    }

    shouldHide(e) {
        return e.which === 1;
    }

    showAt(x, y) {
        let $virtualElement = this.createVirtualElement(x, y);

        this.showFor($virtualElement);
    }

    showFor($element) {
        let rect = $element[0].getBoundingClientRect();
        this.x = rect.left;
        this.y = rect.top;

        requestAnimationFrame(() => {
            this.itemListView.updateItems();

            this.$menu.show();

            this.popper = Popper.createPopper($element[0], this.$menu[0], {
                placement: 'bottom-start',
            });
        });
    }

    hide() {
        this.$menu.hide();
    }

    get isOpened() {
        return this.$menu.is(':visible');
    }

    setItemSelected(item, selected) {
        this.itemListView.setItemSelected(item, selected);
    }

    addItem(item) {
        this.itemListView.addItem(item);
    }

    clearItems() {
        this.itemListView.clearItems();
    }

    createVirtualElement(x, y, w = 0, h = 0) {
        const virtualElement = {
            getBoundingClientRect: () => ({
                width: w,
                height: h,
                left: x,
                top: y,
                right: x + w,
                bottom: y + h,
            }),
        };

        return $(virtualElement);
    }

    createListItem(item) {
        let $listItem = $(`
            <div class='dropdown-item context-menu-item'>
                <i class='context-menu-item-icon ${item.iconClass}'></i>
                <span class='context-menu-item-title'>${item.title}</span>
            </div>
        `);

        $listItem.attr('data-name', item.name);
        $listItem.data('item', item);

        return $listItem;
    }

    createContextMenu() {
        let $contextMenu = $(`<div class='dropdown-menu context-menu'>`);

        $(document.body).append($contextMenu);

        return $contextMenu;
    }
}