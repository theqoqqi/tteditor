import AddRemoveCommand from '../../AddRemoveCommand.js';

export default class AddRemoveNodesCommand extends AddRemoveCommand {

    constructor(editor, mapNodes) {
        super(editor, mapNodes);
    }

    getIndexFor(node) {
        return this.editor.indexOfNode(node);
    }

    addItem(node) {
        this.editor.addNode(node);
    }

    insertItem(node, index) {
        this.editor.insertNode(node, index);
    }

    removeItem(node) {
        this.editor.removeNode(node);
    }
}