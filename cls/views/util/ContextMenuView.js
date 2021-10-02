
export default class ContextMenuView {

    constructor($menu = null) {
        this.$menu = $menu;

        if ($menu === null) {
            this.$menu = this.createContextMenu();
        }

        this.items = {};

        this.bindListeners();
    }

    bindListeners() {
        this.$menu.on('click', '.context-menu-item', e => {
            let $listItem = $(e.currentTarget);
            let item = $listItem.data('item');

            item.clickListener();
        });

        this.$menu.contextmenu(e => false);

        $(window).click(e => this.hide());
    }

    showAt(x, y) {
        let $virtualElement = this.createVirtualElement(x, y);

        this.showFor($virtualElement);
    }

    showFor($element) {
        this.$menu.show();

        this.popper = Popper.createPopper($element[0], this.$menu[0], {
            placement: 'bottom-start',
        });
    }

    hide() {
        this.$menu.hide();
    }

    addItem(item) {
        let $listItem = this.createListItem(item);

        this.$menu.append($listItem);
        this.items[item.name] = item;
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