import AbstractSidebarView from './AbstractSidebarView.js';

export default class LeftSidebarView extends AbstractSidebarView {

    constructor(context) {
        super(context, $('#left-sidebar'));
    }

    openPaletteTab(callback) {
        this.openTab('#palette-sidebar-tab', callback);
    }
}