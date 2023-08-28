import styles from './PaletteItemPreview.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import {MeshIcon} from '../../../../node';

PaletteItemPreview.propTypes = {
    nodeMetadata: PropTypes.instanceOf(Element),
};

function PaletteItemPreview({ nodeMetadata }) {
    return (
        <div className={styles.paletteItemPreview}>
            <MeshIcon tag={nodeMetadata.tagName} />
        </div>
    );
}

export default PaletteItemPreview;