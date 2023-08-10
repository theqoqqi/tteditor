import Observable from '../util/observables/Observable.js';

export default class MapOptions extends Observable {

    constructor() {
        super();

        this.id = null;
        this.music = null;
        this.coloring = null;
        this.fowClearColor = null;
        this.randomizers = [];
    }

    indexOfRandomizer(randomizer) {
        return this.randomizers.indexOf(randomizer);
    }

    insertRandomizer(randomizer, index) {
        this.randomizers.splice(index, 0, randomizer);
    }

    addRandomizer(randomizer) {
        this.randomizers.push(randomizer);
    }

    removeRandomizer(randomizer) {
        let index = this.randomizers.indexOf(randomizer);

        if (index !== -1) {
            this.randomizers.splice(index, 1);
        }
    }
}