import styles from './Node.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import {MapNode, useNodeXml, useObserver} from '../../../shared/editor';
import Meshes from './meshes/Meshes.js';

Node.propTypes = {
    mapNode: PropTypes.instanceOf(MapNode),
    parentMapNode: PropTypes.instanceOf(MapNode),
};

function Node({ mapNode, parentMapNode }) {
    let x = useObserver(mapNode, 'x');
    let y = useObserver(mapNode, 'y');
    let tag = useObserver(mapNode, 'tag');
    let type = useObserver(mapNode, 'type');
    let nodeXml = useNodeXml(tag, type);

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
                />
            )}
        </div>
    );
}

export default Node;