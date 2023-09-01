import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {setSelectedPaletteItem} from '../../../../entities/palette';
import {useMapObserver} from '../../../../shared/lib';

export default function useSyncWithTerrain(tabId, itemId, tag, type) {
    let terrain = useMapObserver('terrain');
    let dispatch = useDispatch();

    useEffect(() => {
        if (tag !== 'terrain') {
            return;
        }

        if (type === terrain?.name) {
            dispatch(setSelectedPaletteItem({
                tabId,
                itemId,
            }));
        }
    }, [dispatch, tabId, itemId, tag, type, terrain]);
}
