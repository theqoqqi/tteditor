let nextEditorId = 1;

export default class AbstractCommand {

    constructor() {
        this.editorId = nextEditorId++;
        this.editor = null;
        this.levelEditor = null;
    }

    setup(editor) {
        this.editor = editor;
        this.levelEditor = editor.getLevelEditor();
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

    isSameTypes(other) {
        return this.constructor.name === other.constructor.name;
    }

    get canUndo() {
        return true;
    }

    get title() {
        return '#' + this.editorId + ': ' + this.constructor.name;
    }
}