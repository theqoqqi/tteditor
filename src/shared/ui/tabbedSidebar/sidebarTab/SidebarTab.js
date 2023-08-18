import styles from './SidebarTab.module.css';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

SidebarTab.propTypes = {
    icon: PropTypes.any,
    title: PropTypes.any,
    flipped: PropTypes.bool,
    selected: PropTypes.bool,
    onSelect: PropTypes.func,
};

export default function SidebarTab({ icon, title, flipped, selected, onSelect }) {

    return (
        <button
            className={classNames(styles.tab, {
                [styles.selected]: selected,
                [styles.flipped]: flipped,
            })}
            onClick={() => onSelect()}
        >
            <span className={styles.title}>
                {title}
            </span>
            <div className={styles.icon}>
                {icon}
            </div>
        </button>
    );
}
