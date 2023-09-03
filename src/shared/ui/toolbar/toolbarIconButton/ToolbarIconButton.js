import styles from './ToolbarIconButton.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import ToolbarButton from '../toolbarButton/ToolbarButton';
import classNames from 'classnames';

ToolbarIconButton.propTypes = {
    className: PropTypes.any,
    iconClassName: PropTypes.any,
    title: PropTypes.string,
    icon: PropTypes.any,
    toggle: PropTypes.bool,
    active: PropTypes.bool,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
};

function ToolbarIconButton({ className, iconClassName, title, icon, toggle, active, disabled, onClick }) {

    let Icon = icon;

    return (
        <ToolbarButton
            title={title}
            className={classNames(styles.toolbarIconButton, className, {
                [styles.toggle]: toggle,
                [styles.active]: active,
            })}
            toggle={toggle}
            active={active}
            disabled={disabled}
            onClick={onClick}
        >
            <Icon className={classNames(styles.icon, iconClassName)} />
        </ToolbarButton>
    );
}

export default ToolbarIconButton;