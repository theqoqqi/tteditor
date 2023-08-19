import styles from './SidebarTab.module.css';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

SidebarTab.propTypes = {
    icon: PropTypes.any,
    title: PropTypes.any,
    side: PropTypes.oneOf(['left', 'right']),
};

export default function SidebarTab({ icon, title, side }) {

    return (
        <div className={styles.tab}>
            <span className={classNames(styles.title, {
                [styles.flipped]: side === 'right',
            })}>
                {title}
            </span>
            <div className={styles.icon}>
                {icon}
            </div>
        </div>
    );
}
