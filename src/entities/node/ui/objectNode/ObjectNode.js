import styles from './ObjectNode.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import {getChildNodeXmls} from '../../lib/xmlUtils.js';
import ObjectMeshes from './objectMeshes/ObjectMeshes.js';
import {MapNode, useEditorContext, useObserver, useRenderContext} from '../../../../shared/lib';
import ObjectSelectionBox from './objectSelectionBox/ObjectSelectionBox.js';
import classNames from 'classnames';
import {createObjectNodeStyles} from '../../lib/cssUtils.js';

ObjectNode.propTypes = {
    className: PropTypes.any,
    mapNode: PropTypes.instanceOf(MapNode),
    nodeXml: PropTypes.oneOfType([
        PropTypes.instanceOf(Document),
        PropTypes.instanceOf(Element),
    ]),
    isChild: PropTypes.bool,
    zIndex: PropTypes.number,
    selected: PropTypes.bool,
    nodeProps: PropTypes.object,
};

function ObjectNode({ className, mapNode, nodeXml, isChild = false, zIndex, selected, nodeProps }) {
    let editorContext = useEditorContext();
    let renderContext = useRenderContext();
    let tag = useObserver(mapNode, 'tag');
    let type = useObserver(mapNode, 'type');
    let isFake = useObserver(mapNode, 'isFake');

    useObserver(mapNode, 'x');
    useObserver(mapNode, 'y');

    let { x, y, z } = renderContext.getCoordsForNode(tag, mapNode, nodeXml, isChild, zIndex);
    let style = createObjectNodeStyles(x, y);
    let title = editorContext.getLocalizedHint(mapNode.hint);
    let childNodeXmls = getChildNodeXmls(nodeXml);

    return (
        <div
            className={classNames(styles.objectNode, className)}
            style={style}
            title={title}
            {...nodeProps}
        >
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
                />
            )}
        </div>
    );
}

export default ObjectNode;