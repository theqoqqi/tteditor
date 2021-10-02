import Observable from './Observable.js';

let elementAddedSymbol = Symbol();
let elementRemovedSymbol = Symbol();

export default class ObservableArray extends Array {

    #observable = new Observable();

    constructor() {
        super();
    }

    push(...items) {
        super.push(...items);

        for (const item of items) {
            this.#observable.triggerPropertyObservers(elementAddedSymbol, item);
        }
    }

    splice(start, deleteCount) {
        let removedItems = super.splice(start, deleteCount);

        for (const item of removedItems) {
            this.#observable.triggerPropertyObservers(elementRemovedSymbol, item);
        }
    }

    observeElementAdded(observer) {
        this.#observable.observeProperty(elementAddedSymbol, observer);
    }

    unobserveElementAdded(observer) {
        this.#observable.unobserveProperty(elementAddedSymbol, observer);
    }

    observeElementRemoved(observer) {
        this.#observable.observeProperty(elementRemovedSymbol, observer);
    }

    unobserveElementRemoved(observer) {
        this.#observable.unobserveProperty(elementRemovedSymbol, observer);
    }
}