import Observable from './Observable';

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
        let index = this.length;
        super.push(...items);

        for (const item of items) {
            this.#observable.triggerPropertyObservers(elementAddedSymbol, item, index++);
        }

        this.#observable.triggerPropertyObservers(listChangedSymbol, this);
    }

    splice(index, deleteCount, ...items) {
        // noinspection JSCheckFunctionSignatures
        let removedItems = super.splice(...arguments);

        for (const item of removedItems) {
            this.#observable.triggerPropertyObservers(elementRemovedSymbol, item);
        }

        for (const item of items) {
            this.#observable.triggerPropertyObservers(elementAddedSymbol, item, index++);
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