import AddRemoveRandomizersCommand from './addRemove/AddRemoveRandomizersCommand.js';

export default class AddRandomizersCommand extends AddRemoveRandomizersCommand {

    constructor(levelAccess, randomizers) {
        super(levelAccess, randomizers);
    }

    get isAddCommand() {
        return true;
    }

    get title() {
        return `Добавлено ${this.targets.length} рандомайзеров`;
    }

    get iconClass() {
        return 'bi-patch-plus-fill';
    }
}