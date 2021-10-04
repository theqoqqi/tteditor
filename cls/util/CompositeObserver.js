import Observable from './Observable.js';
import ObservableArray from './ObservableArray.js';

export default class CompositeObserver {

    constructor() {
        this.observers = [];
        this.observables = [];
    }

    addPropertyObserver(path, observer) {
        this.#addObjectObserver('Property', path, observer);
    }

    addListObserver(path, observer) {
        this.#addListObserver('List', path, observer);
    }

    addElementAddedObserver(path, observer) {
        this.#addListObserver('ElementAdded', path, observer);
    }

    addElementRemovedObserver(path, observer) {
        this.#addListObserver('ElementRemoved', path, observer);
    }

    setSingleObservable(observable) {
        this.detachFrom(this.observables);
        if (observable) {
            this.attachTo(observable);
        }
    }

    attachTo(...observables) {
        for (let observable of observables) {
            this.#attachTo(observable);
        }
    }

    #attachTo(observable) {
        for (const observer of this.observers) {
            let target = CompositeObserver.#resolveTarget(observable, observer);
            let methodName = CompositeObserver.#getObserveMethodName(observer);

            CompositeObserver.#callMethodForObservable(target, methodName, observer);
        }

        this.observables.push(observable);
    }

    detachFrom(...observables) {
        for (let observable of observables) {
            this.#detachFrom(observable);
        }
    }

    #detachFrom(observable) {
        let index = this.observables.indexOf(observable);

        if (index === -1) {
            return;
        }

        for (const observer of this.observers) {
            let target = CompositeObserver.#resolveTarget(observable, observer);
            let methodName = CompositeObserver.#getUnobserveMethodName(observer);

            CompositeObserver.#callMethodForObservable(target, methodName, observer);
        }

        this.observables.splice(index, 1);
    }

    triggerForAll() {
        for (const observable of this.observables) {
            this.triggerFor(observable);
        }
    }

    triggerFor(observable) {
        for (const observer of this.observers) {
            let target = CompositeObserver.#resolveTarget(observable, observer);

            CompositeObserver.#triggerObserverFor(observer, target)
        }
    }

    static #triggerObserverFor(observer, observable) {
        let propertyValue = observable;

        if (observable && observer.class === Observable) {
            let propertyName = CompositeObserver.#getPropertyNameForObserver(observer);
            propertyValue = observable[propertyName];
        }

        if (['Property', 'List'].includes(observer.type)) {
            observer.callback(propertyValue);
        }
    }

    static #callMethodForObservable(observable, methodName, observer) {
        if (observable instanceof Observable) {
            let propertyName = CompositeObserver.#getPropertyNameForObserver(observer);

            return observable[methodName](propertyName, observer.callback);
        }

        if (observable instanceof ObservableArray) {
            return observable[methodName](observer.callback);
        }

        throw new Error('Unsupported observable class: ' + observable.constructor);
    }

    #addObjectObserver(type, path, observer) {
        this.observers.push({
            class: Observable,
            callback: observer,
            path,
            type,
        });
    }

    #addListObserver(type, path, observer) {
        this.observers.push({
            class: ObservableArray,
            callback: observer,
            path,
            type,
        });
    }

    static #resolveTarget(observable, observer) {
        if (observable === null) {
            return null;
        }

        let path = observer.path.split('.');
        let target = observable;

        if (observer.class === Observable) {
            path.pop();
        }

        while (path.length > 0) {
            target = target[path.shift()];
        }

        return target;
    }

    static #getPropertyNameForObserver(observer) {
        let path = observer.path.split('.');

        return path[path.length - 1];
    }

    static #getObserveMethodName(observer) {
        return `observe${observer.type}`;
    }

    static #getUnobserveMethodName(observer) {
        return `unobserve${observer.type}`;
    }
}