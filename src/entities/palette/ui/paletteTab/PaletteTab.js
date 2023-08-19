import styles from './PaletteTab.module.css';
import React from 'react';
import PropTypes from 'prop-types';

PaletteTab.propTypes = {
    title: PropTypes.string,
    icon: PropTypes.elementType,
};

function PaletteTab({ title, icon }) {
    let IconComponent = icon;

    return (
        <div className={styles.paletteTab}>
            <div className={styles.icon}>
                <IconComponent />
            </div>
            <span className={styles.title}>
                {title}
            </span>
        </div>
    );
}

export default PaletteTab;