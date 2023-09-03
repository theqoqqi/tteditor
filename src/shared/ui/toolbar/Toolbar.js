import styles from './Toolbar.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

Toolbar.propTypes = {
    itemRef: PropTypes.any,
    className: PropTypes.any,
    children: PropTypes.any,
    onDoubleClick: PropTypes.func,
};

function Toolbar({ itemRef, className, children, onDoubleClick }) {
    return (
        <div ref={itemRef} className={classNames(styles.toolbar, className)} onDoubleClick={onDoubleClick}>
            {children}
        </div>
    );
}

export default Toolbar;
