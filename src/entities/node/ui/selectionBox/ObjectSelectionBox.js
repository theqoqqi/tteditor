import React from 'react';
import {getMeshXml} from '../../lib/xmlUtils.js';
import SelectionBox from './SelectionBox.js';
import PropTypes from 'prop-types';
import {geometryUtils, useRenderContext} from '../../../../shared/editor';

let ICON_MESH_SIZE = 24;

ObjectSelectionBox.propTypes = {
    nodeXml: PropTypes.oneOfType([
        PropTypes.instanceOf(Document),
        PropTypes.instanceOf(Element),
    ]),
    selected: PropTypes.bool,
    onClick: PropTypes.func,
};

function ObjectSelectionBox({ nodeXml, selected, onClick }) {
    let renderContext = useRenderContext();
    let selectableMeshXml = getMeshXml(nodeXml);
    let meshBounds;

    if (selectableMeshXml) {
        let targetVertices = renderContext.getMeshTargetVertices(selectableMeshXml);

        meshBounds = geometryUtils.verticesToBounds(targetVertices);
    } else {
        let radiusX = ICON_MESH_SIZE / 2;
        let radiusY = ICON_MESH_SIZE / 2;

        meshBounds = geometryUtils.createBounds(-radiusX, -radiusY, radiusX, radiusY);
    }

    if (!meshBounds) {
        console.warn('Unable to create selection box: no mesh', nodeXml);
        return null;
    }

    return (
        <SelectionBox
            selected={selected}
            bounds={meshBounds}
            onClick={onClick}
        />
    );
}

export default ObjectSelectionBox;