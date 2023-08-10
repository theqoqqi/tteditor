import AddRemoveCommand from '../../AddRemoveCommand.js';

export default class AddRemoveTriggersCommand extends AddRemoveCommand {

    constructor(triggers) {
        super(triggers);
    }

    getIndexFor(trigger) {
        return this.levelAccess.indexOfTrigger(trigger);
    }

    addItem(trigger) {
        this.levelAccess.addTrigger(trigger);
    }

    insertItem(trigger, index) {
        this.levelAccess.insertTrigger(trigger, index);
    }

    removeItem(trigger) {
        this.levelAccess.removeTrigger(trigger);
    }
}