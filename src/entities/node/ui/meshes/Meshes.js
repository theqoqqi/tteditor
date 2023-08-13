import React from 'react';
import Mesh from '../mesh/Mesh.js';
import MarkerMesh from '../markerMesh/MarkerMesh.js';
import {MapNode, useRenderContext} from '../../../../shared/editor';
import {getMeshXml} from '../../lib/xmlUtils.js';
import PropTypes from 'prop-types';
import MeshIcon from '../markerMesh/meshIcon/MeshIcon.js';
import allTagStyles from './allTagStyles.js';

Meshes.propTypes = {
    tag: PropTypes.string,
    type: PropTypes.string,
    mapNode: PropTypes.instanceOf(MapNode),
    parentMapNode: PropTypes.instanceOf(MapNode),
    nodeXml: PropTypes.instanceOf(Document),
    zIndex: PropTypes.number,
};

function Meshes({ tag, type, mapNode, parentMapNode, nodeXml, zIndex }) {
    let renderContext = useRenderContext();
    let hasMesh = nodeXml && getMeshXml(nodeXml);
    let hasAnyMesh = nodeXml && nodeXml.querySelector('mesh');

    if (hasMesh) {
        return <Mesh tag={tag} type={type} nodeXml={nodeXml} zIndex={zIndex} />;
    }

    if (!parentMapNode && !hasAnyMesh) {
        let { radiusX, radiusY } = renderContext.getAreaRadiusSizesFor(mapNode);
        let tagStyles = allTagStyles[tag];

        return <>
            {radiusX && radiusY && (
                <MarkerMesh
                    variant='area'
                    sizeX={radiusX * 2}
                    sizeY={radiusY * 2}
                    style={tagStyles.area}
                    zIndex={zIndex}
                />
            )}
            <MarkerMesh variant='icon' size={24} style={tagStyles.icon} zIndex={zIndex}>
                <MeshIcon tag={tag} />
            </MarkerMesh>
        </>;
    }

    return null;
}

export default Meshes;