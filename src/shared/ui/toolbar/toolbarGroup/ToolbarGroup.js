import styles from './ToolbarGroup.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

ToolbarGroup.propTypes = {
    className: PropTypes.any,
    children: PropTypes.any,
};

function ToolbarGroup({ className, children }) {
    return (
        <div className={classNames(styles.toolbarGroup, className)}>
            {children}
        </div>
    );
}

export default ToolbarGroup;