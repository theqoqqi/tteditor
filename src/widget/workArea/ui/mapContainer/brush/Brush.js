import styles from './Brush.module.css';
import React, {useCallback, useEffect} from 'react';
import {AddNodesCommand, useEditor} from '../../../../../shared/lib';
import {Node} from '../../../../../entities/node';
import ClickReceiver from './clickReceiver/ClickReceiver';
import {useDispatch, useSelector} from 'react-redux';
import {selectBrushMapNodes, setBrushPosition} from '../../../../../entities/brush';
import {pointerModes, setPointerMode, usePointerMode} from '../../../../../entities/pointerMode';
import {selectPointerPositionOnMap} from '../../../../../entities/pointerPosition';

function Brush() {
    let editor = useEditor();
    let mapNodes = useSelector(selectBrushMapNodes);
    let pointerMode = usePointerMode();
    let pointerPositionOnMap = useSelector(selectPointerPositionOnMap);
    let dispatch = useDispatch();

    let onPlace = useCallback(mapNodes => {
        editor.executeCommand(new AddNodesCommand(mapNodes));
    }, [editor]);

    let onCancel = useCallback(() => {
        dispatch(setPointerMode(pointerModes.select.name));
    }, [dispatch]);

    useEffect(() => {
        dispatch(setBrushPosition(pointerPositionOnMap));
    }, [dispatch, pointerPositionOnMap]);

    if (pointerMode !== pointerModes.insert) {
        return null;
    }

    return (
        <div className={styles.brush}>
            <ClickReceiver
                x={pointerPositionOnMap.x}
                y={pointerPositionOnMap.y}
                mapNodes={mapNodes}
                onPlace={onPlace}
                onCancel={onCancel}
            />
            {mapNodes.map(mapNode => (
                <Node key={mapNode.editorId} mapNode={mapNode} interactable={false} />
            ))}
        </div>
    );
}

export default Brush;