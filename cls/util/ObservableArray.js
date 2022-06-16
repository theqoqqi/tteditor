import Observable from './Observable.js';

let listChangedSymbol = Symbol();
let elementAddedSymbol = Symbol();
let elementRemovedSymbol = Symbol();

export default class ObservableArray extends Array {

    #observable;

    constructor(items, context) {
        let proxy = super();

        this.#observable = new Observable(context);

        if (items && items.length) {
            this.push(...items);
        }

        return proxy;
    }

    push(...items) {
        super.push(...items);

        for (const item of items) {
            this.#observable.triggerPropertyObservers(elementAddedSymbol, item);
        }

        this.#observable.triggerPropertyObservers(listChangedSymbol, this);
    }

    splice(...args) {
        let removedItems = super.splice(...args);

        for (const item of removedItems) {
            this.#observable.triggerPropertyObservers(elementRemovedSymbol, item);
        }

        this.#observable.triggerPropertyObservers(listChangedSymbol, this);

        return removedItems;
    }

    observeList(observer) {
        this.#observable.observeProperty(listChangedSymbol, observer);
    }

    unobserveList(observer) {
        this.#observable.unobserveProperty(listChangedSymbol, observer);
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