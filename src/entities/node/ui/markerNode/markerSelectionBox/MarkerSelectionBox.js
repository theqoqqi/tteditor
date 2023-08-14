import React from 'react';
import SelectionBox from './../../selectionBox/SelectionBox.js';
import PropTypes from 'prop-types';
import {geometryUtils} from '../../../../../shared/editor';

MarkerSelectionBox.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    selected: PropTypes.bool,
    onClick: PropTypes.func,
};

function MarkerSelectionBox({ width, height, selected, onClick }) {
    let halfWidth = width / 2;
    let halfHeight = height / 2;

    let bounds = geometryUtils.createBounds(-halfWidth, -halfHeight, halfWidth, halfHeight);

    return (
        <SelectionBox
            selected={selected}
            bounds={bounds}
            onClick={onClick}
        />
    );
}

export default MarkerSelectionBox;