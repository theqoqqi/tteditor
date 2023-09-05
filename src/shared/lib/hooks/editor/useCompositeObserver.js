import {useCallback, useEffect, useMemo, useReducer, useState} from 'react';
import {getProperty} from 'dot-prop';
import CompositeObserver from '../../editor/util/observables/CompositeObserver';

let propertyReducer = (state, newValues) => {
    return {
        values: newValues,
    };
};

let listReducer = (state, newValues) => {
    /** @type Array */
    let oldValues = state?.items ?? [];
    let oldArrays = Array.from(oldValues).map(array => array ?? []);
    let newArrays = Array.from(newValues).map(array => array ?? []);

    return {
        values: newValues,
        itemArrays: newArrays,
        addedArrays: newArrays.map(newArray => {
            return newArray.filter((item, index) => !(oldArrays[index] ?? []).includes(item));
        }),
        removedArrays: oldArrays.map(oldArray => {
            return oldArray.filter((item, index) => !(newArrays[index] ?? []).includes(item));
        }),
    };
};

function getProperties(targets, propertyPath) {
    return targets.map(target => getProperty(target, propertyPath));
}

function makeTargetArray(targets) {
    if (targets === null) {
        return [];
    }

    if (Array.isArray(targets)) {
        return targets;
    }

    return [targets];
}

export function useTargetArray(targets) {
    return useMemo(() => makeTargetArray(targets), [targets]);
}

export default function useCompositeObserver(targets, propertyPath, isList = false) {
    let reducer = isList ? listReducer : propertyReducer;
    let initialValue = getProperties(targets, propertyPath);

    let [observer] = useState(new CompositeObserver());
    // noinspection JSCheckFunctionSignatures
    let [state, dispatch] = useReducer(reducer, reducer(null, initialValue));
    
    let dispatchProps = useCallback(() => {
        // noinspection JSCheckFunctionSignatures
        dispatch(getProperties(targets, propertyPath));
    }, [propertyPath, targets]);

    useEffect(() => {
        observer.addPropertyObserver(propertyPath, dispatchProps);

        if (isList) {
            observer.addListObserver(propertyPath, dispatchProps);
        }
    }, [observer, targets, propertyPath, isList, dispatchProps]);

    useEffect(dispatchProps, [dispatchProps]);

    useEffect(() => {
        observer.attachTo(...targets);

        return () => {
            observer.detachFrom(...targets);
        };
    }, [targets, observer]);

    return state;
}
