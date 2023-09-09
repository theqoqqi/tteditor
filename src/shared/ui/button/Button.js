import styles from './Button.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {useHotkeys} from 'react-hotkeys-hook';

function Hotkey({ hotkey, action, disabled }) {
    useHotkeys(hotkey, e => {
        if (disabled) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        action(e);
    });

    return null;
}

Button.propTypes = {
    className: PropTypes.any,
    children: PropTypes.any,
    title: PropTypes.string,
    hotkey: PropTypes.string,
    toggle: PropTypes.bool,
    active: PropTypes.bool,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
};

function Button({ className, children, title, hotkey, toggle, active, disabled, onClick }) {
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
            {hotkey && <Hotkey hotkey={hotkey} action={onClick} disabled={disabled} />}
            {children}
        </div>
    );
}

export default Button;