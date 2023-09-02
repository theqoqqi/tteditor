import {useCallback} from 'react';
import {addAllToSelection} from '../../entities/selection';
import {useDispatch} from 'react-redux';

export default function useSelectMapNodesCallback() {
    let dispatch = useDispatch();

    return useCallback(mapNodes => {
        dispatch(addAllToSelection(mapNodes));
    }, [dispatch]);
}
