import styles from './Map.module.css';
import React from 'react';
import NodeList from './nodeList/NodeList.js';
import {useMap} from '../../../../shared/editor';

function Map() {
    let map = useMap();

    if (!map) {
        return null;
    }

    let style = {
        width: map.width,
        height: map.height,
        backgroundImage: `url('data${map.terrain.texture}')`,
    };

    return (
        <div className={styles.map} style={style}>
            <NodeList />
        </div>
    );
}

export default Map;