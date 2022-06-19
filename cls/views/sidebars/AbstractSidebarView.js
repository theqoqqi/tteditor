
export default class AbstractSidebarView {

    constructor(context, $rootElement) {
        this.context = context;
        this.$root = $rootElement;

        this.bindListeners();
    }

    bindListeners() {
        this.$root.on('click', 'a.sidebar-tab-link', e => {
            let $link = $(e.currentTarget);
            let $sidebar = $link.closest('.sidebar');

            let hasOpenedTab = $sidebar.find('a.sidebar-tab-link:not(.collapsed)').length > 0;
            $sidebar.toggleClass('active', hasOpenedTab);
        });
    }

    openTab(tabId, callback) {
        let $nodeListTab = this.$root.find(tabId);

        if ($nodeListTab.hasClass('show')) {
            callback?.();
        } else {
            $nodeListTab.one('shown.bs.collapse', () => {
                callback?.();
            });
            $nodeListTab.collapse('show');
        }
    }
}