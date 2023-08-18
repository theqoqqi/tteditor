import React from 'react';
import PropTypes from 'prop-types';
import {ToolbarIconButton} from '../../../../shared/ui';
import {pointerModes, selectPointerMode, setPointerMode} from '../../../../entities/editor';
import {useDispatch, useSelector} from 'react-redux';

PointerModeButton.propTypes = {
    mode: PropTypes.string,
};

function PointerModeButton({ mode }) {
    let pointerMode = pointerModes[mode];
    let activePointerMode = useSelector(selectPointerMode);
    let dispatch = useDispatch();
    let isActive = pointerMode.name === activePointerMode;

    function togglePointerMode() {
        dispatch(setPointerMode(pointerMode.name));
    }

    return (
        <ToolbarIconButton
            title={pointerMode.title}
            icon={pointerMode.icon}
            active={isActive}
            onClick={togglePointerMode}
        />
    );
}

export default PointerModeButton;