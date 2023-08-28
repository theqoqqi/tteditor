import styles from './PaletteItem.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import PaletteItemPreview from './paletteItemPreview/PaletteItemPreview.js';
import PaletteItemTitle from './paletteItemTitle/PaletteItemTitle.js';
import usePrototypeMapNodes from '../lib/usePrototypeMapNodes.js';

PaletteItem.propTypes = {
    nodeMetadata: PropTypes.instanceOf(Element),
    name: PropTypes.string,
};

function PaletteItem({ nodeMetadata, name }) {
    let mapNodes = usePrototypeMapNodes(nodeMetadata, name);
    let tag = nodeMetadata.tagName;
    let type = nodeMetadata.getAttribute('name');

    let title = name ?? type ?? tag;

    return (
        <div className={styles.paletteItem}>
            <PaletteItemPreview nodeMetadata={nodeMetadata} mapNodes={mapNodes} />
            <PaletteItemTitle className={styles.title} title={title} />
        </div>
    );
}

export default PaletteItem;