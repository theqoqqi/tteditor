import styles from './MarkerMesh.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import {xmlUtils} from '../../../../entities/editor';
import classNames from 'classnames';
import {createMarkerMeshStyles} from '../../lib/cssUtils.js';

MarkerMesh.propTypes = {
    variant: PropTypes.oneOf(['fallback', 'icon', 'area', 'name', 'caption']),
    className: PropTypes.any,
    children: PropTypes.any,
    style: PropTypes.object,
    meshXml: PropTypes.instanceOf(Element),
    size: PropTypes.number,
    sizeX: PropTypes.number,
    sizeY: PropTypes.number,
    zIndex: PropTypes.number,
};

function MarkerMesh({ variant, className, style, children, meshXml, size, sizeX, sizeY, zIndex }) {
    let width = sizeX ?? size ?? xmlUtils.getNumericContent(meshXml, 'width');
    let height = sizeY ?? size ?? xmlUtils.getNumericContent(meshXml, 'height');
    let color = xmlUtils.getTextContent(meshXml, 'color');

    let meshStyle = createMarkerMeshStyles(width, height, color);

    return (
        <div
            className={classNames(styles.markerMesh, styles[variant], className)}
            style={{...meshStyle, ...style, ...{zIndex}}}
        >
            {children}
        </div>
    );
}

export default MarkerMesh;