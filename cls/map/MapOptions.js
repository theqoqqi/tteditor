
export default class MapOptions {

    constructor() {
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