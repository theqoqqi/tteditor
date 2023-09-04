import styles from './NodeList.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import {selectVisibleLayers} from '../../../../../entities/layers';
import {Node} from '../../../../../entities/node';
import {useSelector} from 'react-redux';
import {EditorContext, MapNode, useMapListObserver} from '../../../../../shared/lib';
import {usePointerMode} from '../../../../../entities/pointerMode';
import {selectHiddenMapNodes} from '../../../../../entities/hiddenNodes';

NodeList.propTypes = {
    selectedMapNodes: PropTypes.arrayOf(PropTypes.instanceOf(MapNode)),
    onClickMapNode: PropTypes.func,
    onPointerDown: PropTypes.func,
    onDoubleClick: PropTypes.func,
};

function NodeList({ selectedMapNodes, onClickMapNode, onPointerDown, onDoubleClick }) {
    let [mapNodes] = useMapListObserver('nodes');
    let visibleLayers = useSelector(selectVisibleLayers);
    let hiddenMapNodes = useSelector(selectHiddenMapNodes);
    let pointerMode = usePointerMode();

    let isSelected = mapNode => pointerMode.canSelectNodes && selectedMapNodes?.includes(mapNode);

    return (
        <div className={styles.mapNodeList}>
            {mapNodes?.map(mapNode => {
                let layerName = EditorContext.getLayerNameByTagName(mapNode.tag);
                let isLayerVisible = visibleLayers.includes(layerName);
                let isHidden = hiddenMapNodes.includes(mapNode);

                return (
                    <Node
                        key={mapNode.editorId}
                        mapNode={mapNode}
                        selected={isSelected(mapNode)}
                        hidden={isHidden || !isLayerVisible}
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