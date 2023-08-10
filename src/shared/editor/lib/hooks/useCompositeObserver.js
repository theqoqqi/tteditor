import {useEffect, useReducer, useState} from 'react';
import {getProperty} from 'dot-prop';
import CompositeObserver from '../../core/util/observables/CompositeObserver.js';

let propertyReducer = (state, newValue) => {
    return {
        value: newValue,
    };
};

let listReducer = (state, newValue) => {
    /** @type Array */
    let oldItems = state?.items ?? [];
    let oldArray = Array.from(oldItems ?? []);
    let newArray = Array.from(newValue ?? []);

    return {
        value: newValue,
        items: newArray,
        added: newArray.filter(item => !oldArray.includes(item)),
        removed: oldArray.filter(item => !newArray.includes(item)),
    };
};

export default function useCompositeObserver(target, propertyPath, isList = false) {
    let reducer = isList ? listReducer : propertyReducer;
    let initialValue = getProperty(target, propertyPath);

    let [observer] = useState(new CompositeObserver());
    let [state, dispatch] = useReducer(reducer, initialValue, reducer);

    useEffect(() => {
        observer.addPropertyObserver(propertyPath, dispatch);

        if (isList) {
            observer.addListObserver(propertyPath, dispatch);
        }
    }, [observer, propertyPath, isList]);

    useEffect(() => {
        dispatch(getProperty(target, propertyPath));
    }, [target, propertyPath]);

    useEffect(() => {
        if (target) {
            observer.attachTo(target);
        }

        return () => {
            if (target) {
                observer.detachFrom(target);
            }
        };
    }, [target, observer]);

    return state;
}
