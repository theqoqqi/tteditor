import Observable from '../util/Observable.js';

export default class RandomizerOption extends Observable {

    constructor(item, count) {
        super();

        this.item = item;
        this.count = count;
    }
}