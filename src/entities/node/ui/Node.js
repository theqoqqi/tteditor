import styles from './Node.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import {MapNode, useNodeXml, useObserver} from '../../../shared/editor';
import Mesh from './mesh/Mesh.js';

Node.propTypes = {
    mapNode: PropTypes.instanceOf(MapNode),
};

function Node({ mapNode }) {
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
            <Mesh tag={tag} type={type} nodeXml={nodeXml} />
        </div>
    );
}

export default Node;