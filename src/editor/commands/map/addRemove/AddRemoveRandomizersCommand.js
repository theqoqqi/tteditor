import AddRemoveCommand from '../../AddRemoveCommand.js';

export default class AddRemoveRandomizersCommand extends AddRemoveCommand {

    constructor(randomizers) {
        super(randomizers);
    }

    getIndexFor(randomizer) {
        return this.editor.indexOfRandomizer(randomizer);
    }

    addItem(randomizer) {
        this.editor.addRandomizer(randomizer);
    }

    insertItem(randomizer, index) {
        this.editor.insertRandomizer(randomizer, index);
    }

    removeItem(randomizer) {
        this.editor.removeRandomizer(randomizer);
    }
}