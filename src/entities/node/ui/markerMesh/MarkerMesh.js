import styles from './MarkerMesh.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import {styling, xmlUtils} from '../../../../shared/editor';
import classNames from 'classnames';

MarkerMesh.propTypes = {
    variant: PropTypes.oneOf(['fallback', 'icon', 'area']),
    className: PropTypes.any,
    meshXml: PropTypes.instanceOf(Element),
    size: PropTypes.number,
    sizeX: PropTypes.number,
    sizeY: PropTypes.number,
};

function MarkerMesh({ variant, className, meshXml, size, sizeX, sizeY }) {
    let width = sizeX ?? size ?? xmlUtils.getNumericContent(meshXml, 'width');
    let height = sizeY ?? size ?? xmlUtils.getNumericContent(meshXml, 'height');

    let style = styling.createMarkerMeshStyles(width, height);

    return (
        <div className={classNames(styles.markerMesh, styles[variant], className)} style={style} />
    );
}

export default MarkerMesh;