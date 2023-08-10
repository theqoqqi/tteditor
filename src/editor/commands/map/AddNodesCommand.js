import AddRemoveNodesCommand from './addRemove/AddRemoveNodesCommand.js';

export default class AddNodesCommand extends AddRemoveNodesCommand {

    constructor(mapNodes) {
        super(mapNodes);
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