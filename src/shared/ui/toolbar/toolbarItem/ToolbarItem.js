import styles from './ToolbarItem.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

ToolbarItem.propTypes = {
    title: PropTypes.string,
    className: PropTypes.any,
    children: PropTypes.any,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
};

function ToolbarItem({ title, className, children, disabled, onClick }) {
    return (
        <div
            title={title}
            className={classNames(styles.toolbarItem, className, {
                [styles.disabled]: disabled,
            })}
            onClick={onClick}
        >
            {children}
        </div>
    );
}

export default ToolbarItem;