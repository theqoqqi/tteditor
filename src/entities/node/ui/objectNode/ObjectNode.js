import styles from './ObjectNode.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import {getChildNodeXmls} from '../../lib/xmlUtils.js';
import Meshes from '../meshes/Meshes.js';
import {MapNode, styling, useEditorContext, useObserver, useRenderContext} from '../../../../shared/editor';

ObjectNode.propTypes = {
    mapNode: PropTypes.instanceOf(MapNode),
    nodeXml: PropTypes.oneOfType([
        PropTypes.instanceOf(Document),
        PropTypes.instanceOf(Element),
    ]),
    isChild: PropTypes.bool,
    zIndex: PropTypes.number,
};

function ObjectNode({ mapNode, nodeXml, isChild = false, zIndex }) {
    let editorContext = useEditorContext();
    let renderContext = useRenderContext();
    let tag = useObserver(mapNode, 'tag');
    let type = useObserver(mapNode, 'type');

    let {x, y, z} = renderContext.getCoordsForNode(tag, mapNode, nodeXml, isChild, zIndex);
    let style = styling.createNodeStyles(x, y);
    let title = editorContext.getLocalizedHint(mapNode.hint);
    let childNodeXmls = getChildNodeXmls(nodeXml);

    return (
        <div className={styles.objectNode} style={style} title={title}>
            <Meshes
                tag={tag}
                type={type}
                mapNode={mapNode}
                isChild={isChild}
                nodeXml={nodeXml}
                zIndex={z}
            />
            {childNodeXmls.map((childNodeXml, index) => (
                <ObjectNode
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

export default ObjectNode;