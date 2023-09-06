import styles from './PanelHeader.module.css';
import React from 'react';
import PropTypes from 'prop-types';

PanelHeader.propTypes = {
    icon: PropTypes.elementType,
    title: PropTypes.string,
};

function PanelHeader({ icon, title }) {
    let Icon = icon;

    return (
        <div className={styles.panelHeader}>
            <Icon className={styles.icon} />
            {title}
        </div>
    );
}

export default PanelHeader;