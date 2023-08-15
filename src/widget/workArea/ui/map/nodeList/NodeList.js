import styles from './NodeList.module.css';
import React from 'react';
import {useMapObserver} from '../../../../../shared/editor';
import {Node} from '../../../../../entities/node';

function NodeList({selectedMapNodes, onClickMapNode, onPointerDown}) {
    /** @type MapNode[] */
    let mapNodes = useMapObserver('nodes');

    let isSelected = mapNode => selectedMapNodes?.includes(mapNode);

    return (
        <div className={styles.mapNodeList}>
            {mapNodes?.map(mapNode => (
                <Node
                    key={mapNode.editorId}
                    mapNode={mapNode}
                    selected={isSelected(mapNode)}
                    onClick={onClickMapNode}
                    onPointerDown={onPointerDown}
                />
            ))}
        </div>
    );
}

export default NodeList;