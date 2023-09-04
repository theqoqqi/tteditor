import styles from './NodeList.module.css';
import React, {useCallback} from 'react';
import PropTypes from 'prop-types';
import {MapNode, RenderContext} from '../../../../../shared/lib';
import NodeListItem from './nodeListItem/NodeListItem';
import {List} from '../../../../../shared/ui';
import {useSelector} from 'react-redux';
import {selectSelectedMapNodes} from '../../../../../entities/selection';
import {actions, useSelectMapNodeCallback, useSelectMapNodesCallback} from '../../../../../features/selection';
import {isHotkeyPressed} from 'react-hotkeys-hook';
import classNames from 'classnames';
import {sort} from 'mathjs';
import {selectNodeListFocusAtId} from '../../../../../entities/focus';
import {selectHiddenMapNodes} from '../../../../../entities/hiddenNodes';

NodeList.propTypes = {
    mapNodes: PropTypes.arrayOf(PropTypes.instanceOf(MapNode)),
};

function NodeList({ mapNodes }) {
    mapNodes ??= [];

    let sortedMapNodes = sort(mapNodes.slice(), (a, b) => {
        let orderA = RenderContext.getOrderForTagName(a.tag);
        let orderB = RenderContext.getOrderForTagName(b.tag);

        if (orderA !== orderB) {
            return orderA - orderB;
        }

        return a.editorId - b.editorId;
    });
    let selectedMapNodes = useSelector(selectSelectedMapNodes);
    let hiddenMapNodes = useSelector(selectHiddenMapNodes);
    let focusAtId = useSelector(selectNodeListFocusAtId);
    let selectMapNode = useSelectMapNodeCallback(() => {
        if (isHotkeyPressed('shift')) {
            return actions.add;
        }

        if (isHotkeyPressed('ctrl')) {
            return actions.toggle;
        }

        return actions.set;
    });
    let selectMapNodes = useSelectMapNodesCallback();

    let onClickMapNode = useCallback(mapNode => {
        if (isHotkeyPressed('shift')) {
            let lastSelectedMapNode = selectedMapNodes[selectedMapNodes.length - 1];

            selectMapNodesBetween(lastSelectedMapNode, mapNode);
        }

        selectMapNode(mapNode);

        function selectMapNodesBetween(firstMapNode, secondMapNode) {
            let lastSelectedMapNodeIndex = sortedMapNodes.indexOf(firstMapNode);
            let mapNodeIndex = sortedMapNodes.indexOf(secondMapNode);
            let fromIndex = Math.min(lastSelectedMapNodeIndex, mapNodeIndex);
            let toIndex = Math.max(lastSelectedMapNodeIndex, mapNodeIndex);
            let mapNodesToSelect = sortedMapNodes.slice(fromIndex, toIndex + 1);

            selectMapNodes(mapNodesToSelect);
        }
    }, [selectedMapNodes, sortedMapNodes, selectMapNode, selectMapNodes]);

    return (
        <List
            className={styles.nodeList}
            items={sortedMapNodes}
            selectedItems={selectedMapNodes}
            onSelect={onClickMapNode}
            keyBy={mapNode => mapNode?.editorId}
            compareBy={mapNode => mapNode?.editorId}
            listItemProps={(mapNode, index, isSelected) => ({
                className: classNames('p-0 border-0', {
                    [styles.selected]: isSelected,
                }),
            })}
            listItemContent={(mapNode, index, isSelected) => (
                <NodeListItem
                    mapNode={mapNode}
                    selected={isSelected}
                    focused={mapNode.editorId === focusAtId}
                    hidden={hiddenMapNodes.includes(mapNode)}
                />
            )}
        />
    );
}

export default NodeList;