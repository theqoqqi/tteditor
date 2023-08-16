import styles from './ToolbarItem.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

ToolbarItem.propTypes = {
    className: PropTypes.any,
    children: PropTypes.any,
    onClick: PropTypes.func,
};

function ToolbarItem({ className, children, onClick }) {
    return (
        <div
            className={classNames(styles.toolbarItem, className)}
            onClick={onClick}
        >
            {children}
        </div>
    );
}

export default ToolbarItem;