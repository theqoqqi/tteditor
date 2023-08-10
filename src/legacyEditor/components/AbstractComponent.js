export default class AbstractComponent {

    editor;

    levelEditor;

    context;

    constructor(editor, viewClass) {
        this.editor = editor;
        this.levelEditor = editor.getLevelEditor();
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