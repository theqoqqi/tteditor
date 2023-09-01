import styles from './Node.module.css';
import React, {memo} from 'react';
import PropTypes from 'prop-types';
import {EditorContext, MapNode, useNodeXml, useObserver} from '../../../shared/lib';
import ObjectNode from './objectNode/ObjectNode';
import MarkerNode from './markerNode/MarkerNode';
import classNames from 'classnames';

Node.propTypes = {
    mapNode: PropTypes.instanceOf(MapNode),
    selected: PropTypes.bool,
    onClick: PropTypes.func,
    onPointerDown: PropTypes.func,
    hidden: PropTypes.bool,
    interactable: PropTypes.bool,
    highlight: PropTypes.bool,
};

function Node({ mapNode, selected, onClick, onPointerDown, hidden, interactable = true, highlight }) {
    let tag = useObserver(mapNode, 'tag');
    let type = useObserver(mapNode, 'type');
    let nodeXml = useNodeXml(tag, type);

    let nodeProps = {
        onClick: () => onClick?.(mapNode),
        onPointerDown: e => onPointerDown?.(e, { mapNode, isSelected: selected }),
    };

    let commonProps = {
        className: classNames(styles.node, {
            [styles.hidden]: hidden,
            [styles.highlight]: highlight,
            [styles.interactable]: interactable,
        }),
        selected,
    };

    if (EditorContext.isMarkerNode(tag)) {
        return (
            <MarkerNode
                mapNode={mapNode}
                nodeProps={nodeProps}
                {...commonProps}
            />
        );
    }

    if (!nodeXml) {
        return null;
    }

    return (
        <ObjectNode
            mapNode={mapNode}
            nodeXml={nodeXml}
            nodeProps={nodeProps}
            {...commonProps}
        />
    );
}

export default memo(Node);