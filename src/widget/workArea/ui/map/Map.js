import styles from './Map.module.css';
import React from 'react';
import NodeList from './nodeList/NodeList.js';
import {selectSelectedMapNodes, useMap} from '../../../../shared/editor';
import {useSelector} from 'react-redux';
import useSelectMapNodeCallback from '../../lib/useSelectOnClickCallback.js';
import useArrowMovement from '../../lib/useArrowMovement.js';

function Map() {
    let map = useMap();
    let selectedMapNodes = useSelector(selectSelectedMapNodes);
    let onClickMapNode = useSelectMapNodeCallback();

    useArrowMovement(selectedMapNodes);

    if (!map) {
        return null;
    }

    let style = {
        width: map.width,
        height: map.height,
        backgroundImage: `url('data${map.terrain.texture}')`,
    };

    return (
        <div className={styles.map} style={style}>
            <NodeList
                selectedMapNodes={selectedMapNodes}
                onClickMapNode={onClickMapNode}
            />
        </div>
    );
}

export default Map;