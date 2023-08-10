import AbstractSidebarView from './AbstractSidebarView.js';

export default class RightSidebarView extends AbstractSidebarView {

    constructor(editor) {
        super(editor, $('#right-sidebar'));
    }

    openNodeListTab(callback) {
        this.openTab('#node-list-sidebar-tab', callback);
    }
}