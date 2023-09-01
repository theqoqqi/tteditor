import styles from './MapContainer.module.css';
import React from 'react';
import Map from '../map/Map';
import Border from './border/Border';
import Brush from './brush/Brush';

function MapContainer() {
    return (
        <div className={styles.mapContainer}>
            <Map />
            <Border />
            <Brush />
        </div>
    );
}

export default MapContainer;