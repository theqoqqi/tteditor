import styles from './Node.module.css';
import React, {memo} from 'react';
import PropTypes from 'prop-types';
import {MapNode, useEditorContext, useNodeXml, useObserver} from '../../../entities/editor';
import ObjectNode from './objectNode/ObjectNode.js';
import MarkerNode from './markerNode/MarkerNode.js';
import classNames from 'classnames';

Node.propTypes = {
    mapNode: PropTypes.instanceOf(MapNode),
    selected: PropTypes.bool,
    onClick: PropTypes.func,
    onPointerDown: PropTypes.func,
    hidden: PropTypes.bool,
    highlight: PropTypes.bool,
};

function Node({ mapNode, selected, onClick, onPointerDown, hidden, highlight }) {
    let editorContext = useEditorContext();
    let tag = useObserver(mapNode, 'tag');
    let type = useObserver(mapNode, 'type');
    let nodeXml = useNodeXml(tag, type);

    let nodeProps = {
        onClick: () => onClick(mapNode),
        onPointerDown: e => onPointerDown?.(e, { mapNode, isSelected: selected }),
    };

    let commonProps = {
        className: classNames({
            [styles.hidden]: hidden,
            [styles.highlight]: highlight,
        }),
        selected,
    };

    if (editorContext.isMarkerNode(tag)) {
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