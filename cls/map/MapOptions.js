import Observable from '../util/Observable.js';

export default class MapOptions extends Observable {

    constructor() {
        super();

        this.id = null;
        this.music = null;
        this.coloring = null;
        this.fowClearColor = null;
        this.randomizers = [];
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