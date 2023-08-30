import {useSelector} from 'react-redux';
import {selectPointerMode} from '../model/pointerModeSlice.js';
import pointerModes from '../model/pointerModes';

export default function usePointerMode() {
    let pointerMode = useSelector(selectPointerMode);

    return pointerModes[pointerMode];
}
