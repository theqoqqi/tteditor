import styles from './MarkerNode.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import {MapNode, RenderContext, useObserver, useRenderContext} from '../../../../shared/lib';
import MarkerMesh from '../markerMesh/MarkerMesh.js';
import MeshIcon from '../markerMesh/meshIcon/MeshIcon.js';
import MarkerSelectionBox from './markerSelectionBox/MarkerSelectionBox.js';
import classNames from 'classnames';
import {createMarkerNodeStyles} from '../../lib/cssUtils.js';

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

    let layerZ = RenderContext.getLayerZForTagName(tag);
    let iconRadius = RenderContext.getIconRadius(tag);
    let {radiusX, radiusY} = renderContext.getAreaRadiusSizesFor(mapNode);
    let hasArea = radiusX > 0 && radiusY > 0;
    let hasIcon = iconRadius > 0;
    let hasText = Boolean(name || type);

    let zIndex = layerZ - radiusX;

    let style = createMarkerNodeStyles(x - radiusX, y - radiusY, radiusX, radiusY);

    return (
        <div
            className={classNames(styles.markerNode, className)}
            style={style}
            {...nodeProps}
        >
            {hasArea && (
                <MarkerMesh
                    variant='area'
                    tag={tag}
                    sizeX={radiusX * 2}
                    sizeY={radiusY * 2}
                    zIndex={zIndex}
                />
            )}
            {hasIcon && (
                <MarkerMesh
                    variant='icon'
                    tag={tag}
                    size={iconRadius * 2}
                    zIndex={zIndex}
                    children={<MeshIcon tag={tag} />}
                />
            )}
            {hasText && (
                <MarkerMesh
                    variant={hasIcon ? 'caption' : 'name'}
                    tag={tag}
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