import styles from './PaletteTabContent.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import {useWorkspace} from '../../../editor';

PaletteTabContent.propTypes = {
    children: PropTypes.any,
};

function PaletteTabContent({ children }) {
    let { workspacePath } = useWorkspace();

    if (!workspacePath) {
        return null;
    }

    return (
        <div className={styles.paletteTabContent}>
            {children}
        </div>
    );
}

export default PaletteTabContent;