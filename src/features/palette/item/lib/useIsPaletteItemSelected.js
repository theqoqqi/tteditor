import {useMapObserver} from '../../../../shared/lib';

export default function useIsPaletteItemSelected(nodeMetadata) {
    let tag = nodeMetadata.tagName;
    let type = nodeMetadata.getAttribute('name');
    let terrain = useMapObserver('terrain');

    if (tag === 'terrain') {
        return type === terrain?.name;
    }

    return false;
}
