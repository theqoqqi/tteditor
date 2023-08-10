import AddRemoveNodesCommand from './addRemove/AddRemoveNodesCommand.js';

export default class RemoveNodesCommand extends AddRemoveNodesCommand {

    constructor(mapNodes) {
        super(mapNodes);
    }

    get isAddCommand() {
        return false;
    }

    get title() {
        return `Удалено ${this.targets.length} объектов`;
    }

    get iconClass() {
        return 'bi-node-minus-fill';
    }
}