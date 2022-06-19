import AbstractSidebarView from './AbstractSidebarView.js';

export default class RightSidebarView extends AbstractSidebarView {

    constructor(context) {
        super(context, $('#right-sidebar'));
    }

    openNodeListTab(callback) {
        this.openTab('#node-list-sidebar-tab', callback);
    }
}