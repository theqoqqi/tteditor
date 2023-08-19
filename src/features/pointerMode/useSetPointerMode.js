import {useCallback} from 'react';
import {setPointerMode} from '../../entities/editor';
import {useDispatch} from 'react-redux';

export default function useSetPointerMode() {
    let dispatch = useDispatch();
    let callback = pointerMode => {
        return dispatch(setPointerMode(pointerMode));
    };

    return useCallback(callback, [dispatch]);
}