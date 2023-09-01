import AddRemoveTriggersCommand from './addRemove/AddRemoveTriggersCommand';

export default class RemoveTriggersCommand extends AddRemoveTriggersCommand {

    get isAddCommand() {
        return false;
    }

    get title() {
        return `Удалено ${this.targets.length} триггеров`;
    }
}