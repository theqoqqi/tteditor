import styles from './PaletteTabContent.module.css';
import React from 'react';
import PropTypes from 'prop-types';

PaletteTabContent.propTypes = {
    configName: PropTypes.string,
    nodeTags: PropTypes.arrayOf(PropTypes.string),
};

function PaletteTabContent({ configName, nodeTags }) {
    return (
        <div className={styles.paletteTabContent}>
            <center>
                <b>
                    Config tag: {configName}
                    <br /><br />
                    Node tags: {nodeTags.join(', ')}
                </b>
            </center>
        </div>
    );
}

export default PaletteTabContent;