import React from 'react';
import PropTypes from 'prop-types';
import {getMeshXml, getTextureXml, isValidMesh} from '../../lib/xmlUtils.js';
import TextureMesh from '../textureMesh/TextureMesh.js';
import MarkerMesh from '../markerMesh/MarkerMesh.js';

Mesh.propTypes = {
    tag: PropTypes.string,
    type: PropTypes.string,
    nodeXml: PropTypes.instanceOf(Document),
    zIndex: PropTypes.number,
};

function Mesh({ tag, type, nodeXml, zIndex }) {
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
        return <MarkerMesh variant='fallback' meshXml={meshXml} zIndex={zIndex} />;
    }

    return <TextureMesh tag={tag} type={type} nodeXml={nodeXml} zIndex={zIndex} />;
}

export default Mesh;