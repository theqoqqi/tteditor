
// noinspection CssInvalidHtmlTagReference
export default class LevelListView {

    constructor(context) {
        this.context = context;
        this.uiNodeFactory = context.getUiNodeFactory();

        this.$levelList = $('#level-list');
    }

    setLevelList(levelList) {
        this.$levelList.empty();

        for (const level of levelList) {
            let $listItem = this.createListItem(level);

            this.$levelList.append($listItem);
            LevelListView.#setLevelDirty($listItem);
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

    isSelectedLevelDirty() {
        let $selectedLevel = this.#getSelectedLevel();

        return LevelListView.#isLevelDirty($selectedLevel);
    }

    setSelectedLevelDirty(isDirty) {
        let $selectedLevel = this.#getSelectedLevel();

        LevelListView.#setLevelDirty($selectedLevel, isDirty);
    }

    static #isLevelDirty($level) {
        return $level.find('.modified-mark').is(':visible');
    }

    static #setLevelDirty($level, isDirty) {
        $level.find('.modified-mark').toggle(isDirty);
    }

    #getSelectedLevel() {
        return this.$levelList.find('> a.active');
    }

    setSelectedFile(filename) {
        let $link = this.$levelList.find('> a').filter(`[data-filename='${filename}']`);

        this.$levelList.find('> a').removeClass('active');
        $link.addClass('active');
    }

    getSelectedFile() {
        return this.#getSelectedLevel().data('filename');
    }

    createListItem(level) {
        // noinspection JSUnresolvedVariable
        return $(`
            <a href='#' class='list-group-item list-group-item-action px-3 py-1'
               data-filename='${level.path}'>
                <div class='level-header'>
                    ${level.map_name}
                    <span class='modified-mark'>изменен</span>
                </div>
                <div class='path'>
                    ${level.path}
                </div>
            </a>
        `);
    }
}