import styles from './ClickReceiver.module.css';
import React, {useCallback} from 'react';
import PropTypes from 'prop-types';
import {MapNode} from '../../../../../../shared/lib/index.js';

ClickReceiver.propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    mapNodes: PropTypes.arrayOf(PropTypes.instanceOf(MapNode)),
};

function ClickReceiver({x, y, mapNodes, onPlace, onCancel}) {
    let onClick = useCallback(() => {
        let mapNodesToPlace = mapNodes.map(mapNode => {
            mapNode = mapNode.clone();
            mapNode.isFake = false;

            return mapNode;
        });

        onPlace(mapNodesToPlace);
    }, [mapNodes, onPlace]);

    let onRightClick = useCallback(e => {
        e.preventDefault();

        onCancel();
    }, [onCancel]);

    let positionStyles = {
        left: x,
        top: y,
    };

    return (
        <div
            className={styles.clickReceiver}
            onClick={onClick}
            onContextMenu={onRightClick}
            style={positionStyles}
        />
    );
}

export default ClickReceiver;