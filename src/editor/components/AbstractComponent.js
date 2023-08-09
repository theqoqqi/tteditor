
export default class AbstractComponent {

    editor;
    context;

    constructor(editor, viewClass) {
        this.editor = editor;
        this.context = editor.getContext();

        this.view = new viewClass(this.editor);

        this.bindListeners();
    }

    bindListeners() {
        // Abstract
    }

    get map() {
        return this.editor.getMap();
    }
}