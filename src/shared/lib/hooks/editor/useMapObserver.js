import useObserver from './useObserver.js';
import useMap from './useMap.js';

export default function useMapObserver(propertyPath) {
    let map = useMap();

    return useObserver(map, propertyPath);
}
