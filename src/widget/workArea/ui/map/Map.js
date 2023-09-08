import styles from './Map.module.css';
import React, {useCallback, useEffect, useRef} from 'react';
import NodeList from './nodeList/NodeList';
import {selectSelectedMapNodes} from '../../../../entities/selection';
import {useMap, useMapObserver} from '../../../../shared/lib';
import {useDispatch, useSelector} from 'react-redux';
import {actions, useSelectMapNodeCallback} from '../../../../features/selection';
import useArrowMovement from '../../lib/useArrowMovement';
import useDragMovement from '../../lib/useDragMovement';
import Terrain from './terrain/Terrain';
import {isHotkeyPressed} from 'react-hotkeys-hook';
import useFocusNodeListAtId from '../../lib/useFocusNodeListAtId';
import {useMouse} from 'react-use';
import {setPointerPositionOnMap} from '../../../../entities/pointerPosition';

function Map() {
    let ref = useRef(null);
    let map = useMap();
    let terrain = useMapObserver('terrain');
    let selectedMapNodes = useSelector(selectSelectedMapNodes);
    let mouse = useMouse(ref);
    let dispatch = useDispatch();
    let resolveAction = useCallback(() => {
        if (isHotkeyPressed('shift')) {
            return actions.add;
        }

        if (isHotkeyPressed('ctrl')) {
            return actions.remove;
        }

        return actions.set;
    }, []);
    let onClickMapNode = useSelectMapNodeCallback(resolveAction);
    let onPointerDown = useDragMovement(selectedMapNodes);
    let onDoubleClick = useFocusNodeListAtId();

    useArrowMovement(selectedMapNodes);

    useMapObserver('width');
    useMapObserver('height');

    useEffect(() => {
        dispatch(setPointerPositionOnMap({
            x: mouse.elX,
            y: mouse.elY,
        }));
    }, [dispatch, mouse.elX, mouse.elY]);

    if (!map) {
        return null;
    }

    let style = {
        width: map.width,
        height: map.height,
    };

    return (
        <div ref={ref} className={styles.map} style={style}>
            <Terrain terrain={terrain} />
            <NodeList
                selectedMapNodes={selectedMapNodes}
                onClickMapNode={onClickMapNode}
                onPointerDown={onPointerDown}
                onDoubleClick={onDoubleClick}
            />
        </div>
    );
}

export default Map;