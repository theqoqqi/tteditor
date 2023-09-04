import styles from './IconButton.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import {Button} from '../../../../shared/ui';
import classNames from 'classnames';

IconButton.propTypes = {
    className: PropTypes.any,
    icon: PropTypes.any,
    ...Button.propTypes,
};

function IconButton({ className, icon, ...buttonProps }) {
    let Icon = icon;

    return (
        <Button
            className={classNames(styles.iconButton, className, {
                [styles.toggle]: buttonProps.toggle,
                [styles.active]: buttonProps.active,
            })}
            {...buttonProps}
        >
            <Icon className={styles.icon} />
        </Button>
    );
}

export default IconButton;