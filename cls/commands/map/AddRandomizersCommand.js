import MultiTargetCommand from '../MultiTargetCommand.js';

export default class AddRandomizersCommand extends MultiTargetCommand {

    constructor(editor, randomizers) {
        super(editor, randomizers);
    }

    executeFor(randomizer) {
        this.editor.addRandomizer(randomizer);
    }

    undoFor(randomizer) {
        this.editor.removeRandomizer(randomizer);
    }

    get title() {
        return `Добавлено ${this.targets.length} рандомайзеров`;
    }

    get iconClass() {
        return 'bi-patch-plus-fill';
    }
}