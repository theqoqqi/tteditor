import AddRemoveCommand from '../../AddRemoveCommand.js';

export default class AddRemoveTriggersCommand extends AddRemoveCommand {

    constructor(editor, triggers) {
        super(editor, triggers);
    }

    getIndexFor(trigger) {
        return this.editor.indexOfTrigger(trigger);
    }

    addItem(trigger) {
        this.editor.addTrigger(trigger);
    }

    insertItem(trigger, index) {
        this.editor.insertTrigger(trigger, index);
    }

    removeItem(trigger) {
        this.editor.removeTrigger(trigger);
    }
}