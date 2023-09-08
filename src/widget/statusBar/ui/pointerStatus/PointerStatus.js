import styles from './PointerStatus.module.css';
import React from 'react';
import {useSelector} from 'react-redux';
import {selectPointerPositionOnMap} from '../../../../entities/pointerPosition';

function PointerStatus() {
    let positionOnMap = useSelector(selectPointerPositionOnMap);

    return (
        <div className={styles.pointerStatus}>
            pos: {positionOnMap.x} {positionOnMap.y}
        </div>
    );
}

export default PointerStatus;