import AddRemoveCommand from '../../AddRemoveCommand.js';

export default class AddRemoveNodesCommand extends AddRemoveCommand {

    constructor(mapNodes) {
        super(mapNodes);
    }

    getIndexFor(node) {
        return this.levelEditor.indexOfNode(node);
    }

    addItem(node) {
        this.levelEditor.addNode(node);
    }

    insertItem(node, index) {
        this.levelEditor.insertNode(node, index);
    }

    removeItem(node) {
        this.levelEditor.removeNode(node);
    }
}