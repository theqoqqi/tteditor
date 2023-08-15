import styles from './MarkerNode.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import {MapNode, styling, useObserver, useRenderContext} from '../../../../shared/editor';
import MarkerMesh from '../markerMesh/MarkerMesh.js';
import MeshIcon from '../markerMesh/meshIcon/MeshIcon.js';
import MarkerSelectionBox from './markerSelectionBox/MarkerSelectionBox.js';
import markerMeshStyles from '../markerMeshStyles.js';
import classNames from 'classnames';

MarkerNode.propTypes = {
    className: PropTypes.any,
    mapNode: PropTypes.instanceOf(MapNode),
    selected: PropTypes.bool,
    nodeProps: PropTypes.object,
};

function MarkerNode({ className, mapNode, selected, nodeProps }) {
    let renderContext = useRenderContext();
    let x = useObserver(mapNode, 'x');
    let y = useObserver(mapNode, 'y');
    let tag = useObserver(mapNode, 'tag');
    let type = useObserver(mapNode, 'type');
    let name = useObserver(mapNode, 'name');

    let layerZ = renderContext.getLayerZForTagName(tag);
    let iconRadius = renderContext.getIconRadius(tag);
    let {radiusX, radiusY} = renderContext.getAreaRadiusSizesFor(mapNode);
    let hasArea = radiusX > 0 && radiusY > 0;
    let hasIcon = iconRadius > 0;
    let hasText = Boolean(name || type);

    let zIndex = layerZ - radiusX;

    let style = styling.createMarkerNodeStyles(x - radiusX, y - radiusY, radiusX, radiusY);
    let tagStyles = markerMeshStyles[tag];

    return (
        <div
            className={classNames(styles.markerNode, className)}
            style={style}
            {...nodeProps}
        >
            {hasArea && (
                <MarkerMesh
                    variant='area'
                    sizeX={radiusX * 2}
                    sizeY={radiusY * 2}
                    zIndex={zIndex}
                    style={tagStyles?.area}
                />
            )}
            {hasIcon && (
                <MarkerMesh
                    variant='icon'
                    size={iconRadius * 2}
                    zIndex={zIndex}
                    children={<MeshIcon tag={tag} />}
                    style={tagStyles?.icon}
                />
            )}
            {hasText && (
                <MarkerMesh
                    variant={hasIcon ? 'caption' : 'name'}
                    zIndex={zIndex}
                    children={name || type}
                />
            )}
            <MarkerSelectionBox
                width={(iconRadius || radiusX) * 2}
                height={(iconRadius || radiusY) * 2}
                selected={selected}
            />
        </div>
    );
}

export default MarkerNode;