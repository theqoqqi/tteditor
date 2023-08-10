import styles from './SidebarTabContent.module.css';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';

SidebarTabContent.propTypes = {
    className: PropTypes.any,
    selected: PropTypes.bool,
    children: PropTypes.any
};

export default function SidebarTabContent({ className, children, selected }) {
    return (
        <div
            className={classNames(styles.tabContent, className, {
                [styles.selected]: selected,
            })}
        >
            {children}
        </div>
    );
}