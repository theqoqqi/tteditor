
export default class ToolbarView {

    constructor(context, uiNodeFactory) {
        this.context = context;
        this.uiNodeFactory = uiNodeFactory;

        this.$saveLevelButton = $('#save-level-button');
    }

    setSaveLevelButtonListener(listener) {
        this.$saveLevelButton.click(() => {
            listener();
        });
    }
}