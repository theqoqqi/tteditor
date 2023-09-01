import styles from './Terrain.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import {MapTerrain, useSelectorWithParams} from '../../../../../shared/lib';
import {selectIsLayerVisible} from '../../../../../entities/layers';
import {createTerrainStyles} from '../../../lib/cssUtils';

Terrain.propTypes = {
    terrain: PropTypes.instanceOf(MapTerrain),
};

function Terrain({ terrain }) {
    let isTerrainLayerVisible = useSelectorWithParams(selectIsLayerVisible, 'terrain');

    let terrainStyles = isTerrainLayerVisible
        ? createTerrainStyles(terrain)
        : null;

    return <div className={styles.terrain} style={terrainStyles} />;
}

export default Terrain;