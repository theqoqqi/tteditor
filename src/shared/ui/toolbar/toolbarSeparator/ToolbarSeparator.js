import styles from './ToolbarSeparator.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

ToolbarSeparator.propTypes = {
    className: PropTypes.any,
};

function ToolbarSeparator({ className }) {
    return (
        <div className={classNames(styles.toolbarSeparator, className)} />
    );
}

export default ToolbarSeparator;