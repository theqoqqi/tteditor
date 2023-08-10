import AbstractCommand from './AbstractCommand.js';

export default class MultiTargetCommand extends AbstractCommand {

    constructor(levelAccess, targets) {
        super(levelAccess);

        this.targets = targets;
        this.reversedTargets = null;
    }

    execute() {
        for (const target of this.targets) {
            this.executeFor(target);
        }
    }

    executeFor(target) {
        // Abstract
    }

    undo() {
        for (const target of this.#getReversedTargets()) {
            this.undoFor(target);
        }
    }

    undoFor(target) {
        // Abstract
    }

    #getReversedTargets() {
        if (!this.reversedTargets) {
            this.reversedTargets = [...this.targets];
            this.reversedTargets.reverse();
        }

        return this.reversedTargets;
    }

    isSameTargets(other) {
        return this.targets.length === other.targets.length
            && this.targets.every((target, index) => target === other.targets[index]);
    }
}