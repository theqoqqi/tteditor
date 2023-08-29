import styles from './Map.module.css';
import React from 'react';
import NodeList from './nodeList/NodeList.js';
import {selectSelectedMapNodes} from '../../../../entities/editor';
import {useMap} from '../../../../shared/lib';
import {useSelector} from 'react-redux';
import useSelectMapNodeCallback from '../../lib/useSelectMapNodeCallback.js';
import useArrowMovement from '../../lib/useArrowMovement.js';
import useDragMovement from '../../lib/useDragMovement.js';
import Terrain from './terrain/Terrain.js';

function Map() {
    let map = useMap();
    let selectedMapNodes = useSelector(selectSelectedMapNodes);
    let onClickMapNode = useSelectMapNodeCallback();
    let onPointerDown = useDragMovement(selectedMapNodes);

    useArrowMovement(selectedMapNodes);

    if (!map) {
        return null;
    }

    let style = {
        width: map.width,
        height: map.height,
    };

    return (
        <div className={styles.map} style={style}>
            <Terrain terrain={map.terrain} />
            <NodeList
                selectedMapNodes={selectedMapNodes}
                onClickMapNode={onClickMapNode}
                onPointerDown={onPointerDown}
            />
        </div>
    );
}

export default Map;