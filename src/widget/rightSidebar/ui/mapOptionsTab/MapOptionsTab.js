import styles from './MapOptionsTab.module.css';
import React from 'react';
import {useMap, useMapObserver} from '../../../../shared/lib';
import MapEditor from './mapEditor/MapEditor';
import MapOptionsEditor from './mapOptionsEditor/MapOptionsEditor';
import {PanelHeader} from '../../../../shared/ui';
import {BsPuzzleFill} from 'react-icons/bs';

function MapOptionsTab() {
    let map = useMap();
    let options = useMapObserver('options') ?? null;

    return (
        <div className={styles.mapOptionsTab}>
            <MapEditor map={map} />
            <PanelHeader icon={BsPuzzleFill} title='Свойства уровня' />
            <MapOptionsEditor options={options} />
        </div>
    );
}

export default MapOptionsTab;