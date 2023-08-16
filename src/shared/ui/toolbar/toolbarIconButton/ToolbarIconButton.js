import styles from './ToolbarIconButton.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import ToolbarItem from '../toolbarItem/ToolbarItem.js';
import classNames from 'classnames';

ToolbarIconButton.propTypes = {
    icon: PropTypes.any,
    toggle: PropTypes.bool,
    active: PropTypes.bool,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
};

function ToolbarIconButton({ icon, toggle, active, disabled, onClick }) {

    let Icon = icon;

    return (
        <ToolbarItem
            className={classNames(styles.toolbarIconButton, {
                [styles.toggle]: toggle,
                [styles.active]: active,
            })}
            disabled={disabled}
            onClick={() => disabled ? null : onClick()}
        >
            <Icon className={styles.icon} />
        </ToolbarItem>
    );
}

export default ToolbarIconButton;