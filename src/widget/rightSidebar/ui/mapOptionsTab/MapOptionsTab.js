import styles from './MapOptionsTab.module.css';
import React from 'react';
import {useMap, useMapObserver, useObserver} from '../../../../shared/lib';
import MapEditor from './mapEditor/MapEditor';
import MapOptionsEditor from './mapOptionsEditor/MapOptionsEditor';
import {PanelHeader} from '../../../../shared/ui';
import {BsPuzzleFill, BsShuffle} from 'react-icons/bs';
import RandomizerList from './randomizerList/RandomizerList';

function MapOptionsTab() {
    let map = useMap();
    let options = useMapObserver('options') ?? null;
    let randomizers = useObserver(options, 'randomizers') ?? [];

    return (
        <div className={styles.mapOptionsTab}>
            <MapEditor map={map} />
            <PanelHeader icon={BsPuzzleFill} title='Свойства уровня' />
            <MapOptionsEditor options={options} />
            <PanelHeader icon={BsShuffle} title='Рандомайзеры' />
            <RandomizerList randomizers={randomizers} />
        </div>
    );
}

export default MapOptionsTab;