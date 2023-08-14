import styles from './NodeList.module.css';
import React from 'react';
import {selectSelectedMapNodes, useMapObserver} from '../../../../../shared/editor';
import {Node} from '../../../../../entities/node';
import {useSelector} from 'react-redux';
import useArrowMovement from '../../../lib/useArrowMovement.js';
import useSelectMapNodeCallback from '../../../lib/useSelectOnClickCallback.js';

function NodeList() {
    /** @type MapNode[] */
    let mapNodes = useMapObserver('nodes');
    let selectedMapNodes = useSelector(selectSelectedMapNodes);
    let onClickMapNode = useSelectMapNodeCallback();

    useArrowMovement(selectedMapNodes);

    let isSelected = mapNode => selectedMapNodes?.includes(mapNode);

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