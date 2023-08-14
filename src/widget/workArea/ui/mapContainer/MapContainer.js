import styles from './MapContainer.module.css';
import React from 'react';
import Map from '../map/Map.js';
import Border from './border/Border.js';

function MapContainer() {
    return (
        <div className={styles.mapContainer}>
            <Map />
            <Border />
        </div>
    );
}

export default MapContainer;