import styles from './Node.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import {MapNode, useEditorContext, useNodeXml, useObserver, useRenderContext} from '../../../shared/editor';
import Meshes from './meshes/Meshes.js';
import {createNodeStyles} from '../../../shared/editor/lib/rendering/styling.js';

Node.propTypes = {
    mapNode: PropTypes.instanceOf(MapNode),
    isChild: PropTypes.bool,
    parentZIndex: PropTypes.number,
};

function Node({ mapNode, isChild = false, parentZIndex }) {
    let editorContext = useEditorContext();
    let renderContext = useRenderContext();
    let tag = useObserver(mapNode, 'tag');
    let type = useObserver(mapNode, 'type');
    let nodeXml = useNodeXml(tag, type);

    if (!nodeXml) {
        return null;
    }

    let {x, y, z} = renderContext.getCoordsForNode(tag, mapNode, nodeXml, isChild, parentZIndex);
    let style = createNodeStyles(x, y);
    let title = editorContext.getLocalizedHint(mapNode.hint);

    return (
        <div className={styles.node} style={style} title={title}>
            {nodeXml && (
                <Meshes
                    tag={tag}
                    type={type}
                    mapNode={mapNode}
                    isChild={isChild}
                    nodeXml={nodeXml}
                    zIndex={z}
                />
            )}
        </div>
    );
}

export default Node;