import MultiTargetCommand from '../MultiTargetCommand.js';

export default class AddNodesCommand extends MultiTargetCommand {

    constructor(editor, mapNodes) {
        super(editor, mapNodes);
    }

    executeFor(mapNode) {
        this.editor.addNode(mapNode);
    }

    undoFor(mapNode) {
        this.editor.removeNode(mapNode);
    }

    get title() {
        return `Добавлено ${this.targets.length} объектов`;
    }

    get iconClass() {
        return 'bi-node-plus-fill';
    }
}