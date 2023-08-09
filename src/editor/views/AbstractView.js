
export default class AbstractView {

    editor;
    context;
    uiNodeFactory;

    constructor(editor) {
        this.editor = editor;
        this.context = editor.getContext();
        this.uiNodeFactory = editor.getUiNodeFactory();
    }

    get map() {
        return this.editor.getMap();
    }
}