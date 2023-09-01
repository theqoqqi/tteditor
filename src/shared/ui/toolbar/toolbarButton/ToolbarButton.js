import styles from './ToolbarButton.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import ToolbarItem from '../toolbarItem/ToolbarItem';
import classNames from 'classnames';

ToolbarButton.propTypes = {
    className: PropTypes.any,
    children: PropTypes.any,
    title: PropTypes.string,
    toggle: PropTypes.bool,
    active: PropTypes.bool,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
};

function ToolbarButton({ className, children, title, toggle, active, disabled, onClick }) {
    return (
        <ToolbarItem
            title={title}
            className={classNames(styles.toolbarButton, className, {
                [styles.disabled]: disabled,
                [styles.toggle]: toggle,
                [styles.active]: active,
            })}
            disabled={disabled}
            onClick={() => disabled ? null : onClick()}
        >
            {children}
        </ToolbarItem>
    );
}

export default ToolbarButton;