import styles from './NodeList.module.css';
import React from 'react';
import {selectSelectedMapNodes, setSelection, useMapObserver} from '../../../../../shared/editor';
import {Node} from '../../../../../entities/node';
import {useDispatch, useSelector} from 'react-redux';

function NodeList() {
    /** @type MapNode[] */
    let mapNodes = useMapObserver('nodes');
    let dispatch = useDispatch();
    let selectedMapNodes = useSelector(selectSelectedMapNodes);

    let isSelected = mapNode => selectedMapNodes?.includes(mapNode);

    function onClickMapNode(mapNode) {
        dispatch(setSelection(mapNode));
    }

    return (
        <div className={styles.mapNodeList}>
            {mapNodes?.map(mapNode => (
                <Node
                    key={mapNode.editorId}
                    mapNode={mapNode}
                    selected={isSelected(mapNode)}
                    onClick={() => onClickMapNode(mapNode)}
                />
            ))}
        </div>
    );
}

export default NodeList;