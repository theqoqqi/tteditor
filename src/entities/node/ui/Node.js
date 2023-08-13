import styles from './Node.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import {MapNode, useNodeXml, useObserver, useRenderContext} from '../../../shared/editor';
import Meshes from './meshes/Meshes.js';

Node.propTypes = {
    mapNode: PropTypes.instanceOf(MapNode),
    parentMapNode: PropTypes.instanceOf(MapNode),
    parentZIndex: PropTypes.number,
};

function Node({ mapNode, parentMapNode, parentZIndex }) {
    let renderContext = useRenderContext();
    let tag = useObserver(mapNode, 'tag');
    let type = useObserver(mapNode, 'type');
    let nodeXml = useNodeXml(tag, type);

    if (!nodeXml) {
        return null;
    }

    let hasParent = !!parentMapNode;
    let {x, y, z} = renderContext.getCoordsForNode(tag, mapNode, nodeXml, hasParent, parentZIndex);

    let style = {
        left: x,
        top: y,
    };

    return (
        <div className={styles.node} style={style}>
            {nodeXml && (
                <Meshes
                    tag={tag}
                    type={type}
                    mapNode={mapNode}
                    parentMapNode={parentMapNode}
                    nodeXml={nodeXml}
                    zIndex={z}
                />
            )}
        </div>
    );
}

export default Node;