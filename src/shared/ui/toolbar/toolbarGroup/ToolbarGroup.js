import styles from './ToolbarGroup.module.css';
import React from 'react';
import PropTypes from 'prop-types';

ToolbarGroup.propTypes = {
    children: PropTypes.any,
};

function ToolbarGroup({ children }) {
    return (
        <div className={styles.toolbarGroup}>
            {children}
        </div>
    );
}

export default ToolbarGroup;