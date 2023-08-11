import styles from './ScrollableMapContainer.module.css';
import React from 'react';
import ScrollContainer from 'react-indiana-drag-scroll';
import {useMap} from '../../../../shared/editor';
import MapContainer from '../mapContainer/MapContainer.js';

let MIDDLE_MOUSE_BUTTON = 1;

function ScrollableMapContainer() {
    let map = useMap();

    return (
        <ScrollContainer className={styles.mapContainer} buttons={[MIDDLE_MOUSE_BUTTON]}>
            {map && <MapContainer />}
        </ScrollContainer>
    );
}

export default ScrollableMapContainer;