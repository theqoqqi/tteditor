import styles from './Tab.module.css';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

Tab.propTypes = {
    className: PropTypes.any,
    selected: PropTypes.bool,
    onSelect: PropTypes.func,
    children: PropTypes.any,
};

export default function Tab({ className, selected, onSelect, children }) {

    return (
        <button
            className={classNames(styles.tab, className, {
                [styles.selected]: selected,
            })}
            onClick={() => onSelect()}
        >
            {children}
        </button>
    );
}
