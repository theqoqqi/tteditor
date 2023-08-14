import styles from './ScrollableMapContainer.module.css';
import React from 'react';
import ScrollContainer from 'react-indiana-drag-scroll';
import {useMap} from '../../../../shared/editor';
import Map from '../map/Map.js';

let MIDDLE_MOUSE_BUTTON = 1;

function ScrollableMapContainer() {
    let map = useMap();

    return (
        <ScrollContainer className={styles.scrollableMapContainer} buttons={[MIDDLE_MOUSE_BUTTON]}>
            <div className={styles.overscrollArea}>
                {map && <Map />}
            </div>
        </ScrollContainer>
    );
}

export default ScrollableMapContainer;