import styles from './Node.module.css';
import React, {memo} from 'react';
import PropTypes from 'prop-types';
import {MapNode, useEditorContext, useNodeXml, useObserver} from '../../../shared/editor';
import ObjectNode from './objectNode/ObjectNode.js';
import MarkerNode from './markerNode/MarkerNode.js';
import classNames from 'classnames';

Node.propTypes = {
    mapNode: PropTypes.instanceOf(MapNode),
    selected: PropTypes.bool,
    onClick: PropTypes.func,
    hidden: PropTypes.bool,
    muted: PropTypes.bool,
    highlight: PropTypes.bool,
};

function Node({ mapNode, selected, onClick, hidden, muted, highlight }) {
    let editorContext = useEditorContext();
    let tag = useObserver(mapNode, 'tag');
    let type = useObserver(mapNode, 'type');
    let nodeXml = useNodeXml(tag, type);

    let nodeProps = {
        className: classNames({
            [styles.hidden]: hidden,
            [styles.muted]: muted,
            [styles.highlight]: highlight,
        }),
        selected,
        onClick: () => onClick(mapNode),
    };

    if (editorContext.isMarkerNode(tag)) {
        return <MarkerNode mapNode={mapNode} {...nodeProps} />;
    }

    if (!nodeXml) {
        return null;
    }

    return <ObjectNode mapNode={mapNode} nodeXml={nodeXml} {...nodeProps} />;
}

export default memo(Node);