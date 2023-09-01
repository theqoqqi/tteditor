import {useSelector} from 'react-redux';
import {selectPointerMode} from '../model/pointerModeSlice';
import pointerModes from '../model/pointerModes';

export default function usePointerMode() {
    let pointerMode = useSelector(selectPointerMode);

    return pointerModes[pointerMode];
}
