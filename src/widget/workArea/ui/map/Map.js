import styles from './Map.module.css';
import React from 'react';
import NodeList from './nodeList/NodeList.js';
import {selectIsLayerVisible, selectSelectedMapNodes, useMap} from '../../../../entities/editor';
import {useSelector} from 'react-redux';
import useSelectMapNodeCallback from '../../lib/useSelectOnClickCallback.js';
import useArrowMovement from '../../lib/useArrowMovement.js';
import useDragMovement from '../../lib/useDragMovement.js';
import {useSelectorWithParams} from '../../../../shared/lib';

function Map() {
    let map = useMap();
    let selectedMapNodes = useSelector(selectSelectedMapNodes);
    let onClickMapNode = useSelectMapNodeCallback();
    let onPointerDown = useDragMovement(selectedMapNodes);
    let isTerrainLayerVisible = useSelectorWithParams(selectIsLayerVisible, 'terrain');

    useArrowMovement(selectedMapNodes);

    if (!map) {
        return null;
    }

    let style = {
        width: map.width,
        height: map.height,
        backgroundImage: isTerrainLayerVisible
            ? `url('data${map.terrain.texture}')`
            : 'none',
    };

    return (
        <div className={styles.map} style={style}>
            <NodeList
                selectedMapNodes={selectedMapNodes}
                onClickMapNode={onClickMapNode}
                onPointerDown={onPointerDown}
            />
        </div>
    );
}

export default Map;