import styles from './NodeList.module.css';
import React from 'react';
import {selectVisibleLayers} from '../../../../../entities/layers';
import {Node} from '../../../../../entities/node';
import {useSelector} from 'react-redux';
import {EditorContext, useMapListObserver} from '../../../../../shared/lib';
import {usePointerMode} from '../../../../../entities/pointerMode';

function NodeList({ selectedMapNodes, onClickMapNode, onPointerDown, onDoubleClick }) {
    let [mapNodes] = useMapListObserver('nodes');
    let visibleLayers = useSelector(selectVisibleLayers);
    let pointerMode = usePointerMode();

    let isSelected = mapNode => pointerMode.canSelectNodes && selectedMapNodes?.includes(mapNode);

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
                        interactable={pointerMode.canSelectNodes}
                        onClick={onClickMapNode}
                        onPointerDown={onPointerDown}
                        onDoubleClick={onDoubleClick}
                    />
                );
            })}
        </div>
    );
}

export default NodeList;