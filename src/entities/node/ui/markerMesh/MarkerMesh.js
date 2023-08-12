import styles from './MarkerMesh.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import {styling} from '../../../../shared/editor';
import classNames from 'classnames';

MarkerMesh.propTypes = {
    variant: PropTypes.oneOf(['fallback']),
    meshXml: PropTypes.instanceOf(Document),
};

function MarkerMesh({ variant, meshXml }) {
    let style = styling.createMarkerMeshStyles(meshXml);

    return (
        <div className={classNames(styles.markerMesh, styles[variant])} style={style} />
    );
}

export default MarkerMesh;