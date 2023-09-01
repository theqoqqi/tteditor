import AddRemoveRandomizersCommand from './addRemove/AddRemoveRandomizersCommand';

export default class RemoveRandomizersCommand extends AddRemoveRandomizersCommand {

    get isAddCommand() {
        return false;
    }

    get title() {
        return `Удалено ${this.targets.length} рандомайзеров`;
    }

    get iconClass() {
        return 'bi-patch-minus-fill';
    }
}