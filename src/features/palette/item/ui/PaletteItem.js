import styles from './PaletteItem.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import PaletteItemPreview from './paletteItemPreview/PaletteItemPreview.js';
import PaletteItemTitle from './paletteItemTitle/PaletteItemTitle.js';

PaletteItem.propTypes = {
    nodeMetadata: PropTypes.instanceOf(Element),
};

function PaletteItem({ nodeMetadata }) {
    let tag = nodeMetadata.tagName;
    let type = nodeMetadata.getAttribute('name');

    let title = type ?? tag;

    return (
        <div className={styles.paletteItem}>
            <PaletteItemPreview nodeMetadata={nodeMetadata} />
            <PaletteItemTitle className={styles.title} title={title} />
        </div>
    );
}

export default PaletteItem;