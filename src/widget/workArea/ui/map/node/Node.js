import styles from './Node.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import MapNode from '../../../../../shared/editor/core/map/MapNode.js';
import {useObserver} from '../../../../../shared/editor';

Node.propTypes = {
    mapNode: PropTypes.instanceOf(MapNode),
};

function Node({ mapNode }) {
    let x = useObserver(mapNode, 'x');
    let y = useObserver(mapNode, 'y');
    let editorId = useObserver(mapNode, 'editorId');

    let style = {
        left: x,
        top: y,
    };

    return (
        <div className={styles.node} style={style}>
            {editorId}
        </div>
    );
}

export default Node;