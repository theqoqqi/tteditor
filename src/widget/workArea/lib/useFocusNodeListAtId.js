import {useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {focusNodeListAtMapNode} from '../../../entities/focus';

export default function useFocusNodeListAtId() {
    let dispatch = useDispatch();

    return useCallback(mapNode => {
        dispatch(focusNodeListAtMapNode(mapNode));
    }, [dispatch]);
}
