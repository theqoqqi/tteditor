import {useMapObserver} from '../../../../shared/lib';

export default function useIsPaletteItemSelected(tag, type) {
    let terrain = useMapObserver('terrain');

    if (tag === 'terrain') {
        return type === terrain?.name;
    }

    return false;
}
