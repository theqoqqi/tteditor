import styles from './PaletteTabContent.module.css';
import React from 'react';
import PropTypes from 'prop-types';

PaletteTabContent.propTypes = {
    children: PropTypes.any,
};

function PaletteTabContent({ children }) {
    return (
        <div className={styles.paletteTabContent}>
            {children}
        </div>
    );
}

export default PaletteTabContent;