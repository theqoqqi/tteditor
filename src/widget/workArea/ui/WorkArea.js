import styles from './WorkArea.module.css';
import React from 'react';
import ScrollableMapContainer from './scrollableMapContainer/ScrollableMapContainer';

function WorkArea() {
    return (
        <div className={styles.workArea}>
            <ScrollableMapContainer />
        </div>
    );
}

export default WorkArea;