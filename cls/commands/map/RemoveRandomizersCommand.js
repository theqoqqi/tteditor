import MultiTargetCommand from '../MultiTargetCommand.js';

export default class RemoveRandomizersCommand extends MultiTargetCommand {

    constructor(editor, randomizers) {
        super(editor, randomizers);
    }

    executeFor(randomizer) {
        this.editor.removeRandomizer(randomizer);
    }

    undoFor(randomizer) {
        this.editor.addRandomizer(randomizer);
    }

    get title() {
        return `Удалено ${this.targets.length} рандомайзеров`;
    }

    get iconClass() {
        return 'bi-patch-minus-fill';
    }
}