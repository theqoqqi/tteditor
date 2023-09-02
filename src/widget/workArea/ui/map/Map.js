import styles from './Map.module.css';
import React from 'react';
import NodeList from './nodeList/NodeList';
import {selectSelectedMapNodes} from '../../../../entities/selection';
import {useMap, useMapObserver} from '../../../../shared/lib';
import {useSelector} from 'react-redux';
import {actions, useSelectMapNodeCallback} from '../../../../features/selection';
import useArrowMovement from '../../lib/useArrowMovement';
import useDragMovement from '../../lib/useDragMovement';
import Terrain from './terrain/Terrain';
import {isHotkeyPressed} from 'react-hotkeys-hook';

function Map() {
    let map = useMap();
    let terrain = useMapObserver('terrain');
    let selectedMapNodes = useSelector(selectSelectedMapNodes);
    let onClickMapNode = useSelectMapNodeCallback(() => {
        if (isHotkeyPressed('shift')) {
            return actions.add;
        }

        if (isHotkeyPressed('ctrl')) {
            return actions.remove;
        }

        return actions.set;
    });
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