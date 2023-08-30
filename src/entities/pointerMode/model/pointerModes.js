import {BsArrowsMove, BsFullscreen} from 'react-icons/bs';

let LEFT_MOUSE_BUTTON = 0;
let MIDDLE_MOUSE_BUTTON = 1;

const pointerModes = {
    select: {
        name: 'select',
        title: 'Режим выделения',
        icon: BsFullscreen,
        scrollButtons: [MIDDLE_MOUSE_BUTTON],
        dragButton: LEFT_MOUSE_BUTTON,
    },
    scroll: {
        name: 'scroll',
        title: 'Режим прокрутки',
        icon: BsArrowsMove,
        scrollButtons: [LEFT_MOUSE_BUTTON, MIDDLE_MOUSE_BUTTON],
        dragButton: null,
    },
};

export default pointerModes;
