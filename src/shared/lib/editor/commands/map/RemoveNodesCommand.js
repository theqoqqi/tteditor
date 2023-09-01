import AddRemoveNodesCommand from './addRemove/AddRemoveNodesCommand';

export default class RemoveNodesCommand extends AddRemoveNodesCommand {

    get isAddCommand() {
        return false;
    }

    get title() {
        return `Удалено ${this.targets.length} объектов`;
    }
}