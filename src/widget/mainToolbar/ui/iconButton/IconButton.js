import styles from './IconButton.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import {Button} from '../../../../shared/ui';
import classNames from 'classnames';

function capitalize(string) {
    return string.replace(string[0], string[0].toUpperCase())
}

function formatHotkey(hotkey) {
    return hotkey.split('+').map(capitalize).join('+');
}

IconButton.propTypes = {
    className: PropTypes.any,
    icon: PropTypes.any,
    hotkey: PropTypes.string,
    ...Button.propTypes,
};

function IconButton({ className, icon, hotkey, ...buttonProps }) {
    let Icon = icon;

    if (hotkey) {
        buttonProps.title ??= '';
        buttonProps.title += `\n${formatHotkey(hotkey)}`;
    }

    return (
        <Button
            className={classNames(styles.iconButton, className, {
                [styles.toggle]: buttonProps.toggle,
                [styles.active]: buttonProps.active,
            })}
            hotkey={hotkey}
            {...buttonProps}
        >
            <Icon className={styles.icon} />
        </Button>
    );
}

export default IconButton;