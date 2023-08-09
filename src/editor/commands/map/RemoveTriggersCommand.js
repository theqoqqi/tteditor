import AddRemoveTriggersCommand from './addRemove/AddRemoveTriggersCommand.js';

export default class RemoveTriggersCommand extends AddRemoveTriggersCommand {

    constructor(editor, triggers) {
        super(editor, triggers);
    }

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