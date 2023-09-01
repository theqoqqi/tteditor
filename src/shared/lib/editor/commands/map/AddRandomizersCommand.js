import AddRemoveRandomizersCommand from './addRemove/AddRemoveRandomizersCommand';

export default class AddRandomizersCommand extends AddRemoveRandomizersCommand {

    get isAddCommand() {
        return true;
    }

    get title() {
        return `Добавлено ${this.targets.length} рандомайзеров`;
    }
}