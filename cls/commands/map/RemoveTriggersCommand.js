import MultiTargetCommand from '../MultiTargetCommand.js';

export default class RemoveTriggersCommand extends MultiTargetCommand {

    constructor(editor, triggers) {
        super(editor, triggers);
    }

    executeFor(trigger) {
        this.editor.removeTrigger(trigger);
    }

    undoFor(trigger) {
        this.editor.addTrigger(trigger);
    }

    get title() {
        return `Удалено ${this.targets.length} триггеров`;
    }

    get iconClass() {
        return 'bi-file-earmark-minus-fill';
    }
}