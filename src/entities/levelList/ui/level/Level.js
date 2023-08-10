import styles from './Level.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

Level.propTypes = {
    level: PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
        path: PropTypes.string,
    }),
    selected: PropTypes.bool,
};

function Level({ level, selected }) {
    return (
        <div
            className={classNames(styles.level, {
                [styles.selected]: selected,
            })}
        >
            <span className={styles.header}>
                {level.title}
            </span>
            <span className={styles.path}>
                {level.path}
            </span>
        </div>
    );
}

export default Level;