import React from 'react';
import PropTypes from 'prop-types';
import {getPluralTagTitle, getTagIconComponent, useSelectorWithParams} from '../../../../shared/lib';
import {selectIsLayerVisible} from '../../../../entities/layers';
import {useToggleLayer} from '../../../../features/layers';
import IconButton from '../iconButton/IconButton';

ToggleLayerButton.propTypes = {
    tag: PropTypes.string,
};

function ToggleLayerButton({ tag }) {
    let Icon = getTagIconComponent(tag);
    let title = getPluralTagTitle(tag);
    let isLayerVisible = useSelectorWithParams(selectIsLayerVisible, tag);
    let toggleLayer = useToggleLayer(tag);

    return (
        <IconButton
            title={title}
            icon={Icon}
            toggle
            active={isLayerVisible}
            onClick={toggleLayer}
        />
    );
}

export default ToggleLayerButton;
