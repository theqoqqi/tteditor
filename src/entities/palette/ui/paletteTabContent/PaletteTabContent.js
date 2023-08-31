import styles from './PaletteTabContent.module.css';
import React from 'react';
import PropTypes from 'prop-types';

PaletteTabContent.propTypes = {
    items: PropTypes.arrayOf(PropTypes.element),
};

function PaletteTabContent({ items }) {
    return (
        <div className={styles.paletteTabContent}>
            {items}
        </div>
    );
}

export default PaletteTabContent;