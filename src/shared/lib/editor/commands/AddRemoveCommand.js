import MultiTargetCommand from './MultiTargetCommand';

export default class AddRemoveCommand extends MultiTargetCommand {

    setup(editor) {
        super.setup(editor);

        this.indexesByItemIds = new Map(this.targets.map(item => {
            return [
                item,
                this.getIndexFor(item)
            ];
        }));
    }

    executeFor(item) {
        this.#performAction(item, this.isAddCommand);
    }

    undoFor(item) {
        this.#performAction(item, !this.isAddCommand);
    }

    #performAction(item, performAddAction) {
        if (performAddAction) {
            this.restoreItem(item);
        } else {
            this.removeItem(item);
        }
    }

    restoreItem(item) {
        let index = this.indexesByItemIds.get(item);

        if (index === undefined || index === -1) {
            this.addItem(item);
        } else {
            this.insertItem(item, index);
        }
    }

    get isAddCommand() {
        // Abstract
        return undefined;
    }

    insertItem(item, index) {
        // Abstract
    }

    addItem(item) {
        // Abstract
    }

    removeItem(item) {
        // Abstract
    }

    getIndexFor(item) {
        // Abstract
    }
}