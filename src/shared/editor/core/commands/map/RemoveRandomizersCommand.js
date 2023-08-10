import AddRemoveRandomizersCommand from './addRemove/AddRemoveRandomizersCommand.js';

export default class RemoveRandomizersCommand extends AddRemoveRandomizersCommand {

    constructor(randomizers) {
        super(randomizers);
    }

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