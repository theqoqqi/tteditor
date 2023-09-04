import React from 'react';
import PropTypes from 'prop-types';
import {pointerModes, selectPointerMode} from '../../../../entities/pointerMode';
import {useSelector} from 'react-redux';
import {useSetPointerMode} from '../../../../features/pointerMode';
import IconButton from '../iconButton/IconButton';

PointerModeButton.propTypes = {
    mode: PropTypes.string,
};

function PointerModeButton({ mode }) {
    let pointerMode = pointerModes[mode];
    let activePointerMode = useSelector(selectPointerMode);
    let setPointerMode = useSetPointerMode();
    let isActive = pointerMode.name === activePointerMode;

    function togglePointerMode() {
        setPointerMode(mode);
    }

    return (
        <IconButton
            title={pointerMode.title}
            icon={pointerMode.icon}
            active={isActive}
            onClick={togglePointerMode}
        />
    );
}

export default PointerModeButton;