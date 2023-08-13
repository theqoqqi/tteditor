import React from 'react';
import Mesh from '../mesh/Mesh.js';
import {getMeshXml} from '../../lib/xmlUtils.js';
import PropTypes from 'prop-types';

Meshes.propTypes = {
    tag: PropTypes.string,
    type: PropTypes.string,
    nodeXml: PropTypes.instanceOf(Document),
};

function Meshes({tag, type, nodeXml}) {
    let hasMesh = nodeXml && getMeshXml(nodeXml);

    return hasMesh && <Mesh tag={tag} type={type} nodeXml={nodeXml} />;
}

export default Meshes;