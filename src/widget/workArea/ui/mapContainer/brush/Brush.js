import styles from './Brush.module.css';
import React, {useCallback, useEffect, useRef} from 'react';
import {AddNodesCommand, useEditor} from '../../../../../shared/lib';
import {Node} from '../../../../../entities/node';
import {useMouse} from 'react-use';
import ClickReceiver from './clickReceiver/ClickReceiver';
import {useDispatch, useSelector} from 'react-redux';
import {selectBrushMapNodes, setBrushPosition} from '../../../../../entities/brush';
import {pointerModes, setPointerMode, usePointerMode} from '../../../../../entities/pointerMode';

function Brush() {
    let editor = useEditor();
    let parentRef = useRef(null);
    let mouse = useMouse(parentRef);
    let mapNodes = useSelector(selectBrushMapNodes);
    let pointerMode = usePointerMode();
    let dispatch = useDispatch();

    let onRefChanged = useCallback(node => {
        parentRef.current = node?.parentNode ?? null;
    }, [parentRef]);

    let onPlace = useCallback(mapNodes => {
        editor.executeCommand(new AddNodesCommand(mapNodes));
    }, [editor]);

    let onCancel = useCallback(() => {
        dispatch(setPointerMode(pointerModes.select.name));
    }, [dispatch]);

    useEffect(() => {
        dispatch(setBrushPosition({
            x: mouse.elX,
            y: mouse.elY,
        }));
    }, [dispatch, mouse.elX, mouse.elY]);

    if (pointerMode !== pointerModes.insert) {
        return null;
    }

    return (
        <div ref={onRefChanged} className={styles.brush}>
            <ClickReceiver
                x={mouse.elX}
                y={mouse.elY}
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