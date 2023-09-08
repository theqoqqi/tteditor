import styles from './MapOptionsTab.module.css';
import React from 'react';
import {useMap} from '../../../../shared/lib';
import MapEditor from './mapEditor/MapEditor';

function MapOptionsTab() {
    let map = useMap();

    return (
        <div className={styles.mapOptionsTab}>
            <MapEditor map={map} />
        </div>
    );
}

export default MapOptionsTab;