
let nextEditorId = 1;

export default class AbstractCommand {

    constructor(levelAccess) {
        this.editorId = nextEditorId++;
        this.levelAccess = levelAccess;
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

    get iconClass() {
        return '';
    }
}