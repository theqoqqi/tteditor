import styles from './MapContainer.module.css';
import React from 'react';
import Map from '../map/Map.js';

function MapContainer() {
    return (
        <div className={styles.mapContainer}>
            <Map />
        </div>
    );
}

export default MapContainer;