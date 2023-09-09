import styles from './NodeList.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import {Node} from '../../../../../entities/node';
import {MapNode, useMapListObserver} from '../../../../../shared/lib';
import {usePointerMode} from '../../../../../entities/pointerMode';
import useIsMapNodeVisible from '../../../lib/useIsMapNodeVisible';

NodeList.propTypes = {
    selectedMapNodes: PropTypes.arrayOf(PropTypes.instanceOf(MapNode)),
    onClickMapNode: PropTypes.func,
    onPointerDown: PropTypes.func,
    onDoubleClick: PropTypes.func,
};

function NodeList({ selectedMapNodes, onClickMapNode, onPointerDown, onDoubleClick }) {
    let [mapNodes] = useMapListObserver('nodes');
    let isMapNodeVisible = useIsMapNodeVisible();
    let pointerMode = usePointerMode();

    let isSelected = mapNode => pointerMode.canSelectNodes && selectedMapNodes?.includes(mapNode);

    return (
        <div className={styles.mapNodeList}>
            {mapNodes?.map(mapNode => (
                <Node
                    key={mapNode.editorId}
                    mapNode={mapNode}
                    selected={isSelected(mapNode)}
                    hidden={!isMapNodeVisible(mapNode)}
                    interactable={pointerMode.canSelectNodes}
                    onClick={onClickMapNode}
                    onPointerDown={onPointerDown}
                    onDoubleClick={onDoubleClick}
                />
            ))}
        </div>
    );
}

export default NodeList;