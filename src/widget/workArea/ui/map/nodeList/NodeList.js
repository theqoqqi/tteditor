import styles from './NodeList.module.css';
import React from 'react';
import {useMapObserver} from '../../../../../shared/editor';
import Node from '../../../../../entities/node/ui/Node.js';

function NodeList() {
    /** @type MapNode[] */
    let mapNodes = useMapObserver('nodes');

    return (
        <div className={styles.mapNodeList}>
            {mapNodes?.map(mapNode => <Node key={mapNode.editorId} mapNode={mapNode} />)}
        </div>
    );
}

export default NodeList;