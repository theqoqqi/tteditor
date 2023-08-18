import {BsArrowsMove, BsFullscreen} from 'react-icons/bs';

const pointerModes = {
    select: {
        name: 'select',
        title: 'Режим выделения',
        icon: BsFullscreen,
    },
    scroll: {
        name: 'scroll',
        title: 'Режим прокрутки',
        icon: BsArrowsMove,
    },
};

export default pointerModes;
