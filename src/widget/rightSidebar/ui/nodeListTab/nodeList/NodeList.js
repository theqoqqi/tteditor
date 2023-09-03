import styles from './NodeList.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import {MapNode, RenderContext} from '../../../../../shared/lib';
import NodeListItem from './nodeListItem/NodeListItem';
import {List} from '../../../../../shared/ui';
import {sort} from 'mathjs';

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

    return (
        <List
            className={styles.nodeList}
            itemClassName='p-0 border-0'
            items={sortedMapNodes}
            keyBy={mapNode => mapNode?.editorId}
            compareBy={mapNode => mapNode?.editorId}
            listItemContent={(mapNode, index, isSelected) => (
                <NodeListItem
                    mapNode={mapNode}
                    selected={isSelected}
                />
            )}
        />
    );
}

export default NodeList;