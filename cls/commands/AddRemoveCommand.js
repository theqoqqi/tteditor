import MultiTargetCommand from './MultiTargetCommand.js';

export default class AddRemoveCommand extends MultiTargetCommand {

    constructor(editor, items) {
        super(editor, items);

        this.indexesByItemIds = new Map(items.map(item => {
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