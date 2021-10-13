import AbstractSidebarView from './AbstractSidebarView.js';

export default class RightSidebarView extends AbstractSidebarView {

    constructor(context) {
        super(context, $('#right-sidebar'));
    }

    openNodeListTab(callback) {
        this.openTab('#node-list-sidebar-tab', callback);
    }

    openTab(tabId, callback) {
        let $nodeListTab = this.$root.find(tabId);

        if ($nodeListTab.hasClass('show')) {
            callback();
        } else {
            $nodeListTab.one('shown.bs.collapse', () => {
                callback();
            });
            $nodeListTab.collapse('show');
        }
    }
}