import useMap from './useMap';
import useListObserver from './useListObserver';

export default function useMapListObserver(propertyPath) {
    let map = useMap();

    return useListObserver(map, propertyPath);
}
