import styles from './Node.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import {MapNode, useEditorContext, useNodeXml, useObserver, useRenderContext} from '../../../shared/editor';
import Meshes from './meshes/Meshes.js';
import {createNodeStyles} from '../../../shared/editor/lib/rendering/styling.js';
import {getChildNodeXmls} from '../lib/xmlUtils.js';

Node.propTypes = {
    mapNode: PropTypes.instanceOf(MapNode),
    nodeXml: PropTypes.oneOfType([
        PropTypes.instanceOf(Document),
        PropTypes.instanceOf(Element),
    ]),
    isChild: PropTypes.bool,
    zIndex: PropTypes.number,
};

function Node({ mapNode, nodeXml, isChild = false, zIndex }) {
    let editorContext = useEditorContext();
    let renderContext = useRenderContext();
    let tag = useObserver(mapNode, 'tag');
    let type = useObserver(mapNode, 'type');
    let rootNodeXml = useNodeXml(tag, type);

    nodeXml ??= rootNodeXml;

    if (!nodeXml) {
        return null;
    }

    let {x, y, z} = renderContext.getCoordsForNode(tag, mapNode, nodeXml, isChild, zIndex);
    let style = createNodeStyles(x, y);
    let title = editorContext.getLocalizedHint(mapNode.hint);
    let childNodeXmls = getChildNodeXmls(nodeXml);

    return (
        <div className={styles.node} style={style} title={title}>
            <Meshes
                tag={tag}
                type={type}
                mapNode={mapNode}
                isChild={isChild}
                nodeXml={nodeXml}
                zIndex={z}
            />
            {childNodeXmls.map((childNodeXml, index) => (
                <Node
                    key={index}
                    mapNode={mapNode}
                    nodeXml={childNodeXml}
                    isChild={true}
                    zIndex={z}
                />
            ))}
        </div>
    );
}

export default Node;