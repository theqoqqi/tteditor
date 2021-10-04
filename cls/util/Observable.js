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

                let isValueSet = Reflect.set(observable, propertyName, value, receiver);

                if (isValueSet) {
                    observable.triggerPropertyObservers(propertyName, value);
                }

                return isValueSet;
            },
        };

        return new Proxy(this, handler);
    }

    triggerPropertyObservers(propertyName, value) {
        let observers = this.getPropertyObservers(propertyName);

        for (const observer of observers) {
            observer(value, this);
        }
    }

    observeProperty(propertyName, observer) {
        let observers = this.getPropertyObservers(propertyName);

        observers.push(observer);
    }

    unobserveProperty(propertyName, observer) {
        let observers = this.getPropertyObservers(propertyName);
        let index = observers.indexOf(observer);

        if (index !== -1) {
            observers.splice(index, 1);
        }
    }

    getPropertyObservers(propertyName) {
        if (!this[allObserversSymbol].has(propertyName)) {
            this[allObserversSymbol].set(propertyName, []);
        }

        return this[allObserversSymbol].get(propertyName);
    }
}