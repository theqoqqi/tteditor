import {useDispatch} from 'react-redux';
import {selectIsLayerVisible, setLayerVisible} from '../../entities/layers';
import {useCallback} from 'react';
import {useSelectorWithParams} from '../../shared/lib';

export default function useToggleLayer(layer) {
    let dispatch = useDispatch();
    let visible = useSelectorWithParams(selectIsLayerVisible, layer);

    return useCallback(() => {
        dispatch(setLayerVisible({
            layer,
            visible: !visible,
        }));
    }, [dispatch, layer, visible]);
}
