import {useSelectorWithParams} from '../../../../shared/lib';
import {selectIsPaletteItemSelected} from '../../../../entities/palette';

export default function useIsPaletteItemSelected(tabId, itemId) {
    let isSelected = useSelectorWithParams(selectIsPaletteItemSelected, tabId, itemId);

    return isSelected;
}
