import styles from './MarkerMesh.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import {xmlUtils} from '../../../../shared/lib';
import classNames from 'classnames';
import {createMarkerMeshStyles} from '../../lib/cssUtils.js';
import markerMeshStyles from './markerMeshStyles.js';

MarkerMesh.propTypes = {
    variant: PropTypes.oneOf(['fallback', 'icon', 'area', 'name', 'caption']),
    className: PropTypes.any,
    children: PropTypes.any,
    style: PropTypes.object,
    tag: PropTypes.string,
    meshXml: PropTypes.instanceOf(Element),
    size: PropTypes.number,
    sizeX: PropTypes.number,
    sizeY: PropTypes.number,
    zIndex: PropTypes.number,
};

function MarkerMesh({ variant, className, style, children, tag, meshXml, size, sizeX, sizeY, zIndex }) {
    let width = sizeX ?? size ?? xmlUtils.getNumericContent(meshXml, 'width');
    let height = sizeY ?? size ?? xmlUtils.getNumericContent(meshXml, 'height');
    let color = xmlUtils.getTextContent(meshXml, 'color');

    let meshStyle = createMarkerMeshStyles(width, height, color);
    let tagStyles = markerMeshStyles[tag]?.[variant] ?? {};

    return (
        <div
            className={classNames(styles.markerMesh, styles[variant], styles[tag], className)}
            style={{...meshStyle, ...tagStyles, ...style, ...{zIndex}}}
        >
            {children}
        </div>
    );
}

export default MarkerMesh;