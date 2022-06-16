
let nextEditorId = 1;

export default class AbstractCommand {

    constructor(editor) {
        this.editorId = nextEditorId++;
        this.editor = editor;
        this.context = editor.getContext();
    }

    execute() {
        // Abstract
    }

    undo() {
        // Abstract
    }

    canBeMerged(other) {
        return false;
    }

    merge(other) {

    }

    get title() {
        return '#' + this.editorId + ': ' + this.constructor.name;
    }
}