import styles from './Toolbar.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

Toolbar.propTypes = {
    itemRef: PropTypes.any,
    className: PropTypes.any,
    children: PropTypes.any,
};

function Toolbar({ itemRef, className, children }) {
    return (
        <div ref={itemRef} className={classNames(styles.toolbar, className)}>
            {children}
        </div>
    );
}

export default Toolbar;
