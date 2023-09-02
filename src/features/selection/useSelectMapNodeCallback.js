import {useCallback} from 'react';
import {addToSelection, removeFromSelection, selectSelectedMapNodes, setSelection} from '../../entities/selection';
import {useDispatch, useSelector} from 'react-redux';

export const actions = {
    add: Symbol('useSelectMapNodeCallback.actions.add'),
    remove: Symbol('useSelectMapNodeCallback.actions.remove'),
    toggle: Symbol('useSelectMapNodeCallback.actions.toggle'),
    set: Symbol('useSelectMapNodeCallback.actions.set'),
};

export default function useSelectMapNodeCallback(resolveAction) {
    let dispatch = useDispatch();
    let selectedMapNodes = useSelector(selectSelectedMapNodes);

    function handleMapNodeClicked(mapNode) {
        let isSelected = selectedMapNodes.includes(mapNode);
        let action = resolveAction();
        let actionCreator = resolveActionCreator(action);

        dispatch(actionCreator(mapNode));

        function resolveActionCreator(action) {
            switch (action) {
                case actions.add:
                    return addToSelection;
                case actions.remove:
                    return removeFromSelection;
                case actions.toggle:
                    return isSelected ? removeFromSelection : addToSelection;
                default:
                    return setSelection;
            }
        }
    }

    return useCallback(handleMapNodeClicked, [dispatch, resolveAction, selectedMapNodes]);
}