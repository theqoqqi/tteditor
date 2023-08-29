import styles from './NodeList.module.css';
import React from 'react';
import {selectVisibleLayers, useMapObserver} from '../../../../../entities/editor';
import {Node} from '../../../../../entities/node';
import {useSelector} from 'react-redux';
import {EditorContext} from '../../../../../shared/lib';

function NodeList({ selectedMapNodes, onClickMapNode, onPointerDown }) {
    /** @type MapNode[] */
    let mapNodes = useMapObserver('nodes');
    let visibleLayers = useSelector(selectVisibleLayers);

    let isSelected = mapNode => selectedMapNodes?.includes(mapNode);

    return (
        <div className={styles.mapNodeList}>
            {mapNodes?.map(mapNode => {
                let layerName = EditorContext.getLayerNameByTagName(mapNode.tag);
                let isLayerVisible = visibleLayers.includes(layerName);

                return (
                    <Node
                        key={mapNode.editorId}
                        mapNode={mapNode}
                        selected={isSelected(mapNode)}
                        hidden={!isLayerVisible}
                        onClick={onClickMapNode}
                        onPointerDown={onPointerDown}
                    />
                );
            })}
        </div>
    );
}

export default NodeList;