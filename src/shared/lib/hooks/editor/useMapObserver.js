import useObserver from './useObserver';
import useMap from './useMap';

export default function useMapObserver(propertyPath) {
    let map = useMap();

    return useObserver(map, propertyPath);
}
