import {useHotkeys} from 'react-hotkeys-hook';
import {hotkeys} from '../../../features/globalHotkeys';
import {useCallback} from 'react';
import {useDispatch} from 'react-redux';
import useVisibleMapNodes from './useVisibleMapNodes';
import {addAllToSelection} from '../../../entities/selection';

export default function useSelectAllMapNodesHotkeys() {
    let visibleMapNodes = useVisibleMapNodes();
    let dispatch = useDispatch();

    let callback = useCallback(() => {
        dispatch(addAllToSelection(visibleMapNodes));
    }, [dispatch, visibleMapNodes]);

    useHotkeys(hotkeys.selectAll, callback, {
        preventDefault: true,
    });
}
