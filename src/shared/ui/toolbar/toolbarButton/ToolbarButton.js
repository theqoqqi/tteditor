import styles from './ToolbarButton.module.css';
import React from 'react';
import PropTypes from 'prop-types';
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
        <div
            title={title}
            className={classNames(styles.toolbarButton, className, {
                [styles.disabled]: disabled,
                [styles.toggle]: toggle,
                [styles.active]: active,
            })}
            onClick={e => disabled ? null : onClick(e)}
        >
            {children}
        </div>
    );
}

export default ToolbarButton;