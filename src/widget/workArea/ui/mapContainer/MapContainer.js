import styles from './MapContainer.module.css';
import React from 'react';
import Map from '../map/Map.js';
import Border from './border/Border.js';
import Brush from './brush/Brush.js';

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