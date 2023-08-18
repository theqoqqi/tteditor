import {useSelector} from 'react-redux';
import {selectPointerMode} from '../../model/pointerModeSlice.js';
import {pointerModes} from '../../index.js';

export default function usePointerMode() {
    let pointerMode = useSelector(selectPointerMode);

    return pointerModes[pointerMode];
}
