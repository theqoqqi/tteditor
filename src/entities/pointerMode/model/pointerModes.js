import {BsArrowsMove, BsFullscreen, BsPlusSquareDotted} from 'react-icons/bs';

let LEFT_MOUSE_BUTTON = 0;
let MIDDLE_MOUSE_BUTTON = 1;

const pointerModes = {
    select: {
        name: 'select',
        title: 'Режим выделения',
        icon: BsFullscreen,
        scrollButtons: [MIDDLE_MOUSE_BUTTON],
        dragButton: LEFT_MOUSE_BUTTON,
        canSelectNodes: true,
        cursor: 'default',
    },
    insert: {
        name: 'insert',
        title: 'Режим вставки',
        icon: BsPlusSquareDotted,
        scrollButtons: [MIDDLE_MOUSE_BUTTON],
        dragButton: null,
        canSelectNodes: false,
        cursor: 'crosshair',
    },
    scroll: {
        name: 'scroll',
        title: 'Режим прокрутки',
        icon: BsArrowsMove,
        scrollButtons: [LEFT_MOUSE_BUTTON, MIDDLE_MOUSE_BUTTON],
        dragButton: null,
        canSelectNodes: false,
        cursor: 'move',
    },
};

export default pointerModes;
