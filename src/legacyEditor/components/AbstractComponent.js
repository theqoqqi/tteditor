export default class AbstractComponent {

    editor;

    levelAccess;

    context;

    constructor(editor, viewClass) {
        this.editor = editor;
        this.levelAccess = editor.getLevelAccess();
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