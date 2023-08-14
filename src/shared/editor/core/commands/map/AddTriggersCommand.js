import AddRemoveTriggersCommand from './addRemove/AddRemoveTriggersCommand.js';

export default class AddTriggersCommand extends AddRemoveTriggersCommand {

    get isAddCommand() {
        return true;
    }

    get title() {
        return `Добавлено ${this.targets.length} триггеров`;
    }

    get iconClass() {
        return 'bi-file-earmark-plus-fill';
    }
}