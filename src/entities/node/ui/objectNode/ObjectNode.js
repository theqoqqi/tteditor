import styles from './ObjectNode.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import {getChildNodeXmls} from '../../lib/xmlUtils.js';
import ObjectMeshes from './objectMeshes/ObjectMeshes.js';
import {MapNode, styling, useEditorContext, useObserver, useRenderContext} from '../../../../shared/editor';
import ObjectSelectionBox from '../selectionBox/ObjectSelectionBox.js';

ObjectNode.propTypes = {
    mapNode: PropTypes.instanceOf(MapNode),
    nodeXml: PropTypes.oneOfType([
        PropTypes.instanceOf(Document),
        PropTypes.instanceOf(Element),
    ]),
    isChild: PropTypes.bool,
    zIndex: PropTypes.number,
    selected: PropTypes.bool,
    onClick: PropTypes.func,
};

function ObjectNode({ mapNode, nodeXml, isChild = false, zIndex, selected, onClick }) {
    let editorContext = useEditorContext();
    let renderContext = useRenderContext();
    let tag = useObserver(mapNode, 'tag');
    let type = useObserver(mapNode, 'type');
    let isFake = useObserver(mapNode, 'isFake');

    let {x, y, z} = renderContext.getCoordsForNode(tag, mapNode, nodeXml, isChild, zIndex);
    let style = styling.createObjectNodeStyles(x, y);
    let title = editorContext.getLocalizedHint(mapNode.hint);
    let childNodeXmls = getChildNodeXmls(nodeXml);

    return (
        <div className={styles.objectNode} style={style} title={title}>
            <ObjectMeshes
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
            {!isChild && !isFake && (
                <ObjectSelectionBox
                    nodeXml={nodeXml}
                    selected={selected}
                    onClick={onClick}
                />
            )}
        </div>
    );
}

export default ObjectNode;