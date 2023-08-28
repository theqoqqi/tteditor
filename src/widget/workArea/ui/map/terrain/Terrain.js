import styles from './Terrain.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import {useSelectorWithParams} from '../../../../../shared/lib';
import {MapTerrain, selectIsLayerVisible} from '../../../../../entities/editor';

Terrain.propTypes = {
    terrain: PropTypes.instanceOf(MapTerrain),
};

function Terrain({ terrain }) {
    let isTerrainLayerVisible = useSelectorWithParams(selectIsLayerVisible, 'terrain');

    let terrainStyles = {
        backgroundImage: isTerrainLayerVisible
            ? `url('data${terrain.texture}')`
            : 'none',
    };

    return <div className={styles.terrain} style={terrainStyles} />;
}

export default Terrain;