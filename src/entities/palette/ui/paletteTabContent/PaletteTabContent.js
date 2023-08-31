import styles from './PaletteTabContent.module.css';
import React from 'react';
import PropTypes from 'prop-types';

PaletteTabContent.propTypes = {
    items: PropTypes.arrayOf(PropTypes.element),
};

/** @param {React.ReactElement[]} items */
function PaletteTabContent({ items }) {
    return (
        <div className={styles.paletteTabContent}>
            {items.map(item => (
                <React.Fragment key={item.props.id}>
                    {item}
                </React.Fragment>
            ))}
        </div>
    );
}

export default PaletteTabContent;