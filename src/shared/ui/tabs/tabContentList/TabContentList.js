import styles from './TabContentList.module.css';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

TabContentList.propTypes = {
    className: PropTypes.any,
    children: PropTypes.any,
};

export default function TabContentList({ className, children }) {
    return (
        <div className={classNames(styles.tabContentList, className)}>
            {children}
        </div>
    );
}
