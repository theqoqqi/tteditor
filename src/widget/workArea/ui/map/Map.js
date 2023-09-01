import styles from './Map.module.css';
import React from 'react';
import NodeList from './nodeList/NodeList';
import {selectSelectedMapNodes} from '../../../../entities/selection';
import {useMap, useMapObserver} from '../../../../shared/lib';
import {useSelector} from 'react-redux';
import useSelectMapNodeCallback from '../../lib/useSelectMapNodeCallback';
import useArrowMovement from '../../lib/useArrowMovement';
import useDragMovement from '../../lib/useDragMovement';
import Terrain from './terrain/Terrain';

function Map() {
    let map = useMap();
    let terrain = useMapObserver('terrain');
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
            <Terrain terrain={terrain} />
            <NodeList
                selectedMapNodes={selectedMapNodes}
                onClickMapNode={onClickMapNode}
                onPointerDown={onPointerDown}
            />
        </div>
    );
}

export default Map;