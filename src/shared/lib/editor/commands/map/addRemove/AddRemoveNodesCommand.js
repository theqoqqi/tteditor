import AddRemoveCommand from '../../AddRemoveCommand';

export default class AddRemoveNodesCommand extends AddRemoveCommand {

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