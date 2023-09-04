import styles from './IconButton.module.css';
import React from 'react';
import {ToolbarButton} from '../../../../../../../shared/ui';
import PropTypes from 'prop-types';
import classNames from 'classnames';

IconButton.propTypes = {
    iconClassName: PropTypes.any,
    icon: PropTypes.any,
    itemSelected: PropTypes.bool,
    ...ToolbarButton.propTypes,
};

function IconButton({ className, iconClassName, icon, itemSelected, active, ...buttonProps }) {
    let Icon = icon;

    return (
        <ToolbarButton
            className={classNames(styles.iconButton, className, {
                [styles.active]: active,
                [styles.itemSelected]: itemSelected,
            })}
            {...buttonProps}
        >
            <Icon className={classNames(styles.icon, iconClassName)} />
        </ToolbarButton>
    );
}

export default IconButton;