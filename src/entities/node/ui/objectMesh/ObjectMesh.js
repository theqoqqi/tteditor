import React from 'react';
import PropTypes from 'prop-types';
import {getMeshXml, getTextureXml, isValidMesh} from '../../lib/xmlUtils.js';
import TextureMesh from '../textureMesh/TextureMesh.js';
import MarkerMesh from '../markerMesh/MarkerMesh.js';

ObjectMesh.propTypes = {
    tag: PropTypes.string,
    type: PropTypes.string,
    nodeXml: PropTypes.oneOfType([
        PropTypes.instanceOf(Document),
        PropTypes.instanceOf(Element),
    ]),
    zIndex: PropTypes.number,
    style: PropTypes.object,
};

function ObjectMesh({ tag, type, nodeXml, zIndex, style }) {
    if (!nodeXml) {
        return null;
    }

    let meshXml = getMeshXml(nodeXml);

    if (!meshXml) {
        return null;
    }

    if (!isValidMesh(meshXml)) {
        console.warn('trying to render mesh without size:', meshXml);
        return null;
    }

    if (nodeXml.querySelector(':scope > keyframe')) {
        console.warn('rendering node with keyframe (not implemented):', tag, nodeXml);
    }

    if (!getTextureXml(nodeXml)) {
        return <MarkerMesh variant='fallback' tag={tag} meshXml={meshXml} zIndex={zIndex} style={style} />;
    }

    return <TextureMesh tag={tag} type={type} nodeXml={nodeXml} zIndex={zIndex} style={style} />;
}

export default ObjectMesh;