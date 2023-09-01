import AddRemoveCommand from '../../AddRemoveCommand';

export default class AddRemoveRandomizersCommand extends AddRemoveCommand {

    getIndexFor(randomizer) {
        return this.levelEditor.indexOfRandomizer(randomizer);
    }

    addItem(randomizer) {
        this.levelEditor.addRandomizer(randomizer);
    }

    insertItem(randomizer, index) {
        this.levelEditor.insertRandomizer(randomizer, index);
    }

    removeItem(randomizer) {
        this.levelEditor.removeRandomizer(randomizer);
    }
}