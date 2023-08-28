import styles from './PaletteTabContent.module.css';
import React from 'react';
import PropTypes from 'prop-types';

PaletteTabContent.propTypes = {
    configName: PropTypes.string,
};

function PaletteTabContent({ configName }) {
    return (
        <div className={styles.paletteTabContent}>
            <center>
                <b>
                    Config tag: {configName}
                </b>
            </center>
        </div>
    );
}

export default PaletteTabContent;