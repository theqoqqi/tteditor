import ObservableArray from './ObservableArray.js';

let allObserversSymbol = Symbol();

export default class Observable {

    [allObserversSymbol] = new Map();

    constructor() {
        let handler = {
            set(observable, propertyName, value, receiver) {
                if (Array.isArray(value)) {
                    value = new ObservableArray(value);
                }

                observable.triggerPropertyObservers(propertyName, value);
                return Reflect.set(observable, propertyName, value, receiver);
            },
        };

        return new Proxy(this, handler);
    }

    triggerPropertyObservers(propertyName, value) {
        let observers = this.getPropertyObservers(propertyName);

        for (const observer of observers) {
            observer(value);
        }
    }

    observeProperty(propertyName, observer) {
        let observers = this.getPropertyObservers(propertyName);

        observers.push(observer);
    }

    getPropertyObservers(propertyName) {
        if (!this[allObserversSymbol].has(propertyName)) {
            this[allObserversSymbol].set(propertyName, []);
        }

        return this[allObserversSymbol].get(propertyName);
    }
}