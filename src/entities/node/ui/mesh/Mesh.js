import React from 'react';
import PropTypes from 'prop-types';
import {getMeshXml, getTextureXml, isValidMesh} from '../../lib/xmlUtils.js';
import TextureMesh from '../textureMesh/TextureMesh.js';
import MarkerMesh from '../markerMesh/MarkerMesh.js';

Mesh.propTypes = {
    tag: PropTypes.string,
    type: PropTypes.string,
    nodeXml: PropTypes.instanceOf(Document),
};

function Mesh({ tag, type, nodeXml }) {
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

    if (!getTextureXml(nodeXml)) {
        return <MarkerMesh variant='fallback' meshXml={meshXml} />;
    }

    return <TextureMesh tag={tag} type={type} nodeXml={nodeXml} />;
}

export default Mesh;