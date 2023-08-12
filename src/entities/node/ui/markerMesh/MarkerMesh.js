import styles from './MarkerMesh.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import {styling, xmlUtils} from '../../../../shared/editor';
import classNames from 'classnames';

MarkerMesh.propTypes = {
    variant: PropTypes.oneOf(['fallback']),
    meshXml: PropTypes.instanceOf(Document),
};

function MarkerMesh({ variant, meshXml }) {
    let width = xmlUtils.getNumericContent(meshXml, 'width');
    let height = xmlUtils.getNumericContent(meshXml, 'height');

    let style = styling.createMarkerMeshStyles(width, height);

    return (
        <div className={classNames(styles.markerMesh, styles[variant])} style={style} />
    );
}

export default MarkerMesh;