
// noinspection CssInvalidHtmlTagReference
export default class LevelListView {

    constructor(context, uiNodeFactory) {
        this.context = context;
        this.uiNodeFactory = uiNodeFactory;

        this.$levelList = $('#level-list');
    }

    setLevelList(levelList) {
        this.$levelList.empty();

        for (const level of levelList) {
            let $listItem = this.createListItem(level);

            this.$levelList.append($listItem);
        }
    }

    addFileClickListener(listener) {
        this.$levelList.on('click', 'a', e => {
            e.preventDefault();

            let $link = $(e.currentTarget);
            let filename = $link.data('filename');

            listener(filename);
        });
    }

    setSelectedFile(filename) {
        let $link = this.$levelList.find('> a').filter(`[data-filename='${filename}']`);

        this.$levelList.find('> a').removeClass('active');
        $link.addClass('active');
    }

    getSelectedFile() {
        return this.$levelList.find('> a.active').data('filename');
    }

    createListItem(level) {
        // noinspection JSUnresolvedVariable
        return $(`
            <a href='#' class='list-group-item list-group-item-action px-3 py-1'
               data-filename='${level.path}'>
                ${level.map_name}
                <div class='path'>
                    ${level.path}
                </div>
            </a>
        `);
    }
}