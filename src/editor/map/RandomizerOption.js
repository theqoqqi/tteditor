import Observable from '../util/observables/Observable.js';

let nextEditorId = 1;

export default class RandomizerOption extends Observable {

    constructor(item, count) {
        super();

        this.editorId = nextEditorId++;
        this.item = item;
        this.count = count;
    }
}