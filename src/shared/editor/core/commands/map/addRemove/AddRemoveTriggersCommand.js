import AddRemoveCommand from '../../AddRemoveCommand.js';

export default class AddRemoveTriggersCommand extends AddRemoveCommand {

    getIndexFor(trigger) {
        return this.levelEditor.indexOfTrigger(trigger);
    }

    addItem(trigger) {
        this.levelEditor.addTrigger(trigger);
    }

    insertItem(trigger, index) {
        this.levelEditor.insertTrigger(trigger, index);
    }

    removeItem(trigger) {
        this.levelEditor.removeTrigger(trigger);
    }
}