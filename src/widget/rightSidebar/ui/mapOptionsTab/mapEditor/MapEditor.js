import styles from './MapEditor.module.css';
import React, {useMemo} from 'react';
import PropTypes from 'prop-types';
import {GameMap, useMapObserver} from '../../../../../shared/lib';
import {ObjectEditor} from '../../../../../entities/objectEditor';
import {mapControls} from '../../../lib/mapControls';
import useMapEditorCallback from '../../../lib/useMapEditorCallback';

MapEditor.propTypes = {
    map: PropTypes.instanceOf(GameMap),
};

function MapEditor({ map }) {
    let wrappedMap = useMemo(() => [map], [map]);
    let onChange = useMapEditorCallback(map);

    useMapObserver('width');
    useMapObserver('height');
    useMapObserver('startX');
    useMapObserver('startY');
    useMapObserver('playerBaseX');
    useMapObserver('playerBaseY');

    if (!map) {
        return null;
    }

    return (
        <div className={styles.mapOptionsEditor}>
            <ObjectEditor
                objects={wrappedMap}
                controls={mapControls}
                onChange={onChange}
            />
        </div>
    );
}

export default MapEditor;