import styles from './SidebarTabContentList.module.css';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

SidebarTabContentList.propTypes = {
    className: PropTypes.any,
    children: PropTypes.any,
};

export default function SidebarTabContentList({ className, children }) {
    return (
        <div className={classNames(styles.tabContentList, className)}>
            {children}
        </div>
    );
}
