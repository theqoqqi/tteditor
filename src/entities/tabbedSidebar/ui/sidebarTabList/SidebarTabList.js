import styles from './SidebarTabList.module.css';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

SidebarTabList.propTypes = {
    className: PropTypes.any,
    map: PropTypes.arrayOf(PropTypes.any),
};

export default function SidebarTabList({ className, children }) {
    return (
        <nav className={classNames(styles.tabList, className)}>
            {children}
        </nav>
    );
}
