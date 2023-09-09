import {useCallback} from 'react';
import {RemoveNodesCommand, useEditor} from '../../shared/lib';
import {useDispatch} from 'react-redux';
import {removeAllFromSelection} from '../../entities/selection';

export default function useRemoveMapNodes() {
    let editor = useEditor();
    let dispatch = useDispatch();

    return useCallback(mapNodes => {
        if (mapNodes?.length) {
            editor.executeCommand(new RemoveNodesCommand(mapNodes));
            dispatch(removeAllFromSelection(mapNodes));
        }
    }, [editor, dispatch]);
}
