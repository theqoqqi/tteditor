import useMap from './useMap.js';
import useListObserver from './useListObserver.js';

export default function useMapListObserver(propertyPath) {
    let map = useMap();

    return useListObserver(map, propertyPath);
}
