import styles from './Button.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

Button.propTypes = {
    className: PropTypes.any,
    children: PropTypes.any,
    title: PropTypes.string,
    toggle: PropTypes.bool,
    active: PropTypes.bool,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
};

function Button({ className, children, title, toggle, active, disabled, onClick }) {
    return (
        <div
            title={title}
            className={classNames(styles.button, className, {
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

export default Button;