import styles from './NodesPreview.module.css';
import React, {useRef} from 'react';
import PropTypes from 'prop-types';
import {Node} from '../../../../../../entities/node';
import {MapNode} from '../../../../../../shared/lib';
import classNames from 'classnames';
import useRescaleNodesToFitPreview from '../../../lib/useRescaleNodesToFitPreview.js';

NodesPreview.propTypes = {
    nodeMetadata: PropTypes.instanceOf(Element),
    mapNodes: PropTypes.arrayOf(PropTypes.instanceOf(MapNode)),
};

function NodesPreview({ nodeMetadata, mapNodes }) {
    let ref = useRef();
    let { isVisible, scalingStyles } = useRescaleNodesToFitPreview(ref, nodeMetadata);

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