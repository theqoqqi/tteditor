import styles from './TabList.module.css';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

TabList.propTypes = {
    className: PropTypes.any,
    map: PropTypes.arrayOf(PropTypes.any),
};

export default function TabList({ className, children }) {
    return (
        <nav className={classNames(styles.tabList, className)}>
            {children}
        </nav>
    );
}
