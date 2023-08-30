import styles from './NodesPreview.module.css';
import React, {useRef} from 'react';
import PropTypes from 'prop-types';
import {Node} from '../../../../../../entities/node';
import {MapNode, useNodeXml} from '../../../../../../shared/lib';
import classNames from 'classnames';
import useRescaleNodesToFitPreview from '../../../lib/useRescaleNodesToFitPreview.js';

NodesPreview.propTypes = {
    tag: PropTypes.string,
    type: PropTypes.string,
    mapNodes: PropTypes.arrayOf(PropTypes.instanceOf(MapNode)),
};

function NodesPreview({ tag, type, mapNodes }) {
    let ref = useRef();
    let nodeXml = useNodeXml(tag, type);
    let { isVisible, scalingStyles } = useRescaleNodesToFitPreview(ref, nodeXml);

    return (
        <div
            ref={ref}
            className={classNames(styles.nodesPreview, {
                [styles.visible]: isVisible,
            })}
            style={scalingStyles}
        >
            {mapNodes.map(mapNode => <Node key={mapNode.editorId} mapNode={mapNode} />)}
        </div>
    );
}

export default NodesPreview;