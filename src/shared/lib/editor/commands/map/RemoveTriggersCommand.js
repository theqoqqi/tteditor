import AddRemoveTriggersCommand from './addRemove/AddRemoveTriggersCommand';

export default class RemoveTriggersCommand extends AddRemoveTriggersCommand {

    get isAddCommand() {
        return false;
    }

    get title() {
        return `Удалено ${this.targets.length} триггеров`;
    }

    get iconClass() {
        return 'bi-file-earmark-minus-fill';
    }
}