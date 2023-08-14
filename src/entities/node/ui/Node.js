import React from 'react';
import PropTypes from 'prop-types';
import {MapNode, useEditorContext, useNodeXml, useObserver} from '../../../shared/editor';
import ObjectNode from './objectNode/ObjectNode.js';
import MarkerNode from './markerNode/MarkerNode.js';

Node.propTypes = {
    mapNode: PropTypes.instanceOf(MapNode),
    nodeXml: PropTypes.instanceOf(Document),
    selected: PropTypes.bool,
    onClick: PropTypes.func,
};

function Node({ mapNode, selected, onClick }) {
    let editorContext = useEditorContext();
    let tag = useObserver(mapNode, 'tag');
    let type = useObserver(mapNode, 'type');
    let nodeXml = useNodeXml(tag, type);

    let nodeProps = {
        selected,
        onClick,
    };

    if (editorContext.isMarkerNode(tag)) {
        return <MarkerNode mapNode={mapNode} {...nodeProps} />;
    }

    if (!nodeXml) {
        return null;
    }

    return <ObjectNode mapNode={mapNode} nodeXml={nodeXml} {...nodeProps} />;
}

export default Node;