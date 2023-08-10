import AbstractSidebarView from './AbstractSidebarView.js';

export default class LeftSidebarView extends AbstractSidebarView {

    constructor(editor) {
        super(editor, $('#left-sidebar'));
    }

    openPaletteTab(callback) {
        this.openTab('#palette-sidebar-tab', callback);
    }
}