import AddRemoveCommand from '../../AddRemoveCommand.js';

export default class AddRemoveRandomizersCommand extends AddRemoveCommand {

    constructor(randomizers) {
        super(randomizers);
    }

    getIndexFor(randomizer) {
        return this.levelAccess.indexOfRandomizer(randomizer);
    }

    addItem(randomizer) {
        this.levelAccess.addRandomizer(randomizer);
    }

    insertItem(randomizer, index) {
        this.levelAccess.insertRandomizer(randomizer, index);
    }

    removeItem(randomizer) {
        this.levelAccess.removeRandomizer(randomizer);
    }
}