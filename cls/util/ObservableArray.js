
let allObserversSymbol = Symbol();
let elementAddedSymbol = Symbol();
let elementRemovedSymbol = Symbol();

export default class ObservableArray extends Array {

    [allObserversSymbol] = new Map();

    constructor() {
        super();
    }

    push(...items) {
        super.push(...items);

        for (const item of items) {
            this.triggerObservers(elementAddedSymbol, item);
        }
    }

    splice(start, deleteCount) {
        let removedItems = super.splice(start, deleteCount);

        for (const item of removedItems) {
            this.triggerObservers(elementRemovedSymbol, item);
        }
    }

    triggerObservers(eventName, value) {
        let observers = this.getObservers(eventName);

        for (const observer of observers) {
            observer(value);
        }
    }

    observeElementAdded(observer) {
        let observers = this.getObservers(elementAddedSymbol);

        observers.push(observer);
    }

    observeElementRemoved(observer) {
        let observers = this.getObservers(elementRemovedSymbol);

        observers.push(observer);
    }

    getObservers(eventName) {
        if (!this[allObserversSymbol].has(eventName)) {
            this[allObserversSymbol].set(eventName, []);
        }

        return this[allObserversSymbol].get(eventName);
    }
}