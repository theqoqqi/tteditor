import styles from './Toolbar.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

Toolbar.propTypes = {
    className: PropTypes.any,
    children: PropTypes.any,
};

function Toolbar({ className, children }) {
    return (
        <div className={classNames(styles.toolbar, className)}>
            {children}
        </div>
    );
}

export default Toolbar;
