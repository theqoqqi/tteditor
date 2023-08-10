import AddRemoveCommand from '../../AddRemoveCommand.js';

export default class AddRemoveNodesCommand extends AddRemoveCommand {

    constructor(levelAccess, mapNodes) {
        super(levelAccess, mapNodes);
    }

    getIndexFor(node) {
        return this.levelAccess.indexOfNode(node);
    }

    addItem(node) {
        this.levelAccess.addNode(node);
    }

    insertItem(node, index) {
        this.levelAccess.insertNode(node, index);
    }

    removeItem(node) {
        this.levelAccess.removeNode(node);
    }
}