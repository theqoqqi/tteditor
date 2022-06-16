import MultiTargetCommand from '../MultiTargetCommand.js';

export default class AddTriggersCommand extends MultiTargetCommand {

    constructor(editor, triggers) {
        super(editor, triggers);
    }

    executeFor(trigger) {
        this.editor.addTrigger(trigger);
    }

    undoFor(trigger) {
        this.editor.removeTrigger(trigger);
    }
}