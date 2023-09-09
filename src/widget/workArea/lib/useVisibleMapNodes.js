import {useMapListObserver} from '../../../shared/lib';
import useIsMapNodeVisible from './useIsMapNodeVisible';

export default function useVisibleMapNodes() {
    let [mapNodes] = useMapListObserver('nodes');
    let isMapNodeVisible = useIsMapNodeVisible();

    return mapNodes.filter(isMapNodeVisible);
}
