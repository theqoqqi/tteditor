
export default class ToolbarView {

    constructor(context) {
        this.context = context;
        this.uiNodeFactory = context.getUiNodeFactory();

        this.$resetLevelButton = $('#reset-level-button');
        this.$saveLevelButton = $('#save-level-button');
        this.$downloadLevelButton = $('#download-level-button');
    }

    setResetLevelButtonListener(listener) {
        this.$resetLevelButton.click(() => {
            listener();
        });
    }

    setSaveLevelButtonListener(listener) {
        this.$saveLevelButton.click(() => {
            listener();
        });
    }

    setDownloadLevelButtonListener(listener) {
        this.$downloadLevelButton.click(() => {
            listener();
        });
    }
}