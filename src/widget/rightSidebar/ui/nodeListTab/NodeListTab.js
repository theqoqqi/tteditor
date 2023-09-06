import styles from './NodeListTab.module.css';
import React from 'react';
import NodeList from './nodeList/NodeList';
import {useMapListObserver} from '../../../../shared/lib';
import NodeEditor from './nodeEditor/NodeEditor';
import {useSelector} from 'react-redux';
import {selectSelectedMapNodes} from '../../../../entities/selection';

function NodeListTab() {
    let [mapNodes] = useMapListObserver('nodes');
    let selectedMapNodes = useSelector(selectSelectedMapNodes);

    return (
        <div className={styles.nodeListTab}>
            <NodeList mapNodes={mapNodes} />
            <NodeEditor mapNodes={selectedMapNodes} />
        </div>
    );
}

export default NodeListTab;