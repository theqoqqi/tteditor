import styles from './IconButton.module.css';
import React from 'react';
import {Button} from '../../button';
import PropTypes from 'prop-types';
import classNames from 'classnames';

IconButton.propTypes = {
    iconClassName: PropTypes.any,
    icon: PropTypes.any,
    itemSelected: PropTypes.bool,
    ...Button.propTypes,
};

function IconButton({ className, iconClassName, icon, itemSelected, toggle, active, ...buttonProps }) {
    let Icon = icon;

    return (
        <Button
            className={classNames(styles.iconButton, className, {
                [styles.toggle]: toggle,
                [styles.active]: active,
                [styles.itemSelected]: itemSelected,
            })}
            {...buttonProps}
        >
            <Icon className={classNames(styles.icon, iconClassName)} />
        </Button>
    );
}

export default IconButton;