import React from 'react';
import PropTypes from 'prop-types';
import {getPluralTagTitle, getTagIconComponent, useSelectorWithParams} from '../../../../shared/lib';
import {ToolbarIconButton} from '../../../../shared/ui';
import {selectIsLayerVisible} from '../../../../entities/editor';
import {useToggleLayer} from '../../../../features/layers';

ToggleLayerButton.propTypes = {
    tag: PropTypes.string,
};

function ToggleLayerButton({ tag }) {
    let Icon = getTagIconComponent(tag);
    let title = getPluralTagTitle(tag);
    let isLayerVisible = useSelectorWithParams(selectIsLayerVisible, tag);
    let toggleLayer = useToggleLayer(tag);

    return (
        <ToolbarIconButton
            title={title}
            icon={Icon}
            toggle
            active={isLayerVisible}
            onClick={toggleLayer}
        />
    );
}

export default ToggleLayerButton;
