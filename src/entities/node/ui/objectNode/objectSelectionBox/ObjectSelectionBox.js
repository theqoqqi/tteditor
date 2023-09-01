import React from 'react';
import {getMeshXml} from '../../../lib/xmlUtils';
import SelectionBox from './../../selectionBox/SelectionBox';
import PropTypes from 'prop-types';
import {geometryUtils, RenderContext} from '../../../../../shared/lib';

let ICON_MESH_SIZE = 24;

ObjectSelectionBox.propTypes = {
    nodeXml: PropTypes.oneOfType([
        PropTypes.instanceOf(Document),
        PropTypes.instanceOf(Element),
    ]),
    selected: PropTypes.bool,
};

function ObjectSelectionBox({ nodeXml, selected }) {
    let selectableMeshXml = getMeshXml(nodeXml);
    let meshBounds;

    if (selectableMeshXml) {
        let targetVertices = RenderContext.getMeshTargetVertices(selectableMeshXml);

        if (targetVertices) {
            meshBounds = geometryUtils.verticesToBounds(targetVertices);
        }
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
        />
    );
}

export default ObjectSelectionBox;