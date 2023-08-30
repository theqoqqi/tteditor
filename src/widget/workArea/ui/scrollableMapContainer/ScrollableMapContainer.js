import styles from './ScrollableMapContainer.module.css';
import React from 'react';
import ScrollContainer from 'react-indiana-drag-scroll';
import {usePointerMode} from '../../../../entities/pointerMode';
import {useMap} from '../../../../shared/lib';
import MapContainer from '../mapContainer/MapContainer.js';

function ScrollableMapContainer() {
    let map = useMap();
    let pointerMode = usePointerMode();

    return (
        <ScrollContainer className={styles.scrollableMapContainer} buttons={pointerMode.scrollButtons}>
            <div className={styles.overscrollArea}>
                {map && <MapContainer />}
            </div>
        </ScrollContainer>
    );
}

export default ScrollableMapContainer;