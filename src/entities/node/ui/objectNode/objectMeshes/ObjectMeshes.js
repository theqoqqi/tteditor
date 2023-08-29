import React from 'react';
import ObjectMesh from '../../objectMesh/ObjectMesh.js';
import MarkerMesh from '../../markerMesh/MarkerMesh.js';
import {MapNode, useRenderContext} from '../../../../../shared/lib';
import {getMeshXml} from '../../../lib/xmlUtils.js';
import PropTypes from 'prop-types';
import MeshIcon from '../../markerMesh/meshIcon/MeshIcon.js';

ObjectMeshes.propTypes = {
    tag: PropTypes.string,
    type: PropTypes.string,
    mapNode: PropTypes.instanceOf(MapNode),
    isChild: PropTypes.bool,
    nodeXml: PropTypes.oneOfType([
        PropTypes.instanceOf(Document),
        PropTypes.instanceOf(Element),
    ]),
    zIndex: PropTypes.number,
};

function ObjectMeshes({ tag, type, mapNode, isChild, nodeXml, zIndex }) {
    let renderContext = useRenderContext();
    let hasMesh = nodeXml && getMeshXml(nodeXml);
    let hasAnyMesh = nodeXml && nodeXml.querySelector('mesh');

    if (hasMesh) {
        return <ObjectMesh tag={tag} type={type} nodeXml={nodeXml} zIndex={zIndex} />;
    }

    if (!isChild && !hasAnyMesh) {
        let { radiusX, radiusY } = renderContext.getAreaRadiusSizesFor(mapNode);

        return <>
            {radiusX > 0 && radiusY > 0 && (
                <MarkerMesh
                    variant='area'
                    tag={tag}
                    sizeX={radiusX * 2}
                    sizeY={radiusY * 2}
                    zIndex={zIndex}
                />
            )}
            <MarkerMesh variant='icon' tag={tag} size={24} zIndex={zIndex}>
                <MeshIcon tag={tag} />
            </MarkerMesh>
        </>;
    }

    return null;
}

export default ObjectMeshes;