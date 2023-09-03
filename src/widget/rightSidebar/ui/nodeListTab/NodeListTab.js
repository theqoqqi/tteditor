import styles from './NodeListTab.module.css';
import React from 'react';
import NodeList from './nodeList/NodeList';
import {useMapListObserver} from '../../../../shared/lib';

function NodeListTab() {
    let [mapNodes] = useMapListObserver('nodes');

    return (
        <div className={styles.nodeListTab}>
            <NodeList mapNodes={mapNodes} />
        </div>
    );
}

export default NodeListTab;