import {useCallback} from 'react';
import {isHotkeyPressed} from 'react-hotkeys-hook';
import {addToSelection, removeFromSelection, setSelection} from '../../../entities/editor';
import {useDispatch} from 'react-redux';

export default function useSelectOnClickCallback() {
    let dispatch = useDispatch();

    function handleMapNodeClicked(mapNode) {
        if (isHotkeyPressed('shift')) {
            dispatch(addToSelection(mapNode));

        } else if (isHotkeyPressed('ctrl')) {
            dispatch(removeFromSelection(mapNode));

        } else {
            dispatch(setSelection(mapNode));
        }
    }

    return useCallback(handleMapNodeClicked, [dispatch]);
}