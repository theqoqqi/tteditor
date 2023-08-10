import AddRemoveNodesCommand from './addRemove/AddRemoveNodesCommand.js';

export default class AddNodesCommand extends AddRemoveNodesCommand {

    constructor(levelAccess, mapNodes) {
        super(levelAccess, mapNodes);
    }

    get isAddCommand() {
        return true;
    }

    get title() {
        return `Добавлено ${this.targets.length} объектов`;
    }

    get iconClass() {
        return 'bi-node-plus-fill';
    }
}