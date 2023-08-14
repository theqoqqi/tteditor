import styles from './NodeList.module.css';
import React, {useCallback} from 'react';
import {
    addToSelection,
    removeFromSelection,
    selectSelectedMapNodes,
    setSelection,
    useMapObserver
} from '../../../../../shared/editor';
import {Node} from '../../../../../entities/node';
import {useDispatch, useSelector} from 'react-redux';
import {isHotkeyPressed, useHotkeys} from 'react-hotkeys-hook';

function NodeList() {
    /** @type MapNode[] */
    let mapNodes = useMapObserver('nodes');
    let dispatch = useDispatch();
    let selectedMapNodes = useSelector(selectSelectedMapNodes);
    let onClickMapNode = useCallback(handleMapNodeClicked, [dispatch]);

    useHotkeys('up, down, left, right', (e, handler) => {
        let h = handler.keys.includes('right') - handler.keys.includes('left');
        let v = handler.keys.includes('down') - handler.keys.includes('up');
        let baseStepSize = 5;
        let stepSize = 1;

        if (isHotkeyPressed('shift')) {
            stepSize *= baseStepSize;
        }

        if (isHotkeyPressed('ctrl')) {
            stepSize *= baseStepSize;
        }

        if (!isHotkeyPressed('alt')) {
            stepSize *= baseStepSize;
        }

        for (const mapNode of selectedMapNodes) {
            mapNode.x += h * stepSize;
            mapNode.y += v * stepSize;
        }
    }, {
        ignoreModifiers: true,
    }, [selectedMapNodes]);

    let isSelected = mapNode => selectedMapNodes?.includes(mapNode);

    function handleMapNodeClicked(mapNode) {
        if (isHotkeyPressed('shift')) {
            dispatch(addToSelection(mapNode));

        } else if (isHotkeyPressed('ctrl')) {
            dispatch(removeFromSelection(mapNode));

        } else {
            dispatch(setSelection(mapNode));
        }
    }

    return (
        <div className={styles.mapNodeList}>
            {mapNodes?.map(mapNode => (
                <Node
                    key={mapNode.editorId}
                    mapNode={mapNode}
                    selected={isSelected(mapNode)}
                    onClick={onClickMapNode}
                />
            ))}
        </div>
    );
}

export default NodeList;