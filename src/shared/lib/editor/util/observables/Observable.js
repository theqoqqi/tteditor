import ObservableArray from './ObservableArray';

let allObserversSymbol = Symbol();

export default class Observable {

    [allObserversSymbol] = new Map();

    context;

    constructor(context) {
        context = context ?? this;
        this.context = context;

        let handler = {
            set(observable, propertyName, value, receiver) {
                if (Array.isArray(value)) {
                    value = new ObservableArray(value, context);
                }

                let oldValue = Reflect.get(observable, propertyName, receiver);
                let isValueSet = Reflect.set(observable, propertyName, value, receiver);

                if (isValueSet) {
                    observable.triggerPropertyObservers(propertyName, value, oldValue);
                }

                return isValueSet;
            },
        };

        return new Proxy(this, handler);
    }

    triggerPropertyObservers(propertyName, value, oldValue) {
        let observers = this.getPropertyObservers(propertyName);

        for (const observer of observers) {
            observer(value, oldValue, this.context);
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