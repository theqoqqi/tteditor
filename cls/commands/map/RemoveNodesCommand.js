import MultiTargetCommand from '../MultiTargetCommand.js';

export default class RemoveNodesCommand extends MultiTargetCommand {

    constructor(editor, mapNodes) {
        super(editor, mapNodes);
    }

    executeFor(mapNode) {
        this.editor.removeNode(mapNode);
    }

    undoFor(mapNode) {
        this.editor.addNode(mapNode);
    }

    get title() {
        return `Удалено ${this.targets.length} объектов`;
    }

    get iconClass() {
        return 'bi-node-minus-fill';
    }
}