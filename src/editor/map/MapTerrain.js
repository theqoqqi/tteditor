import Observable from '../util/observables/Observable.js';

export default class MapTerrain extends Observable {

    constructor(name) {
        super();

        this.name = name;
        this.width = null;
        this.height = null;
        this.texture = null;
        this.color = null;
    }
}