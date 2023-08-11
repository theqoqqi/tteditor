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
    changed: PropTypes.bool,
};

function Level({ level, selected, changed }) {
    return (
        <div
            className={classNames(styles.level, {
                [styles.selected]: selected,
            })}
        >
            <div className={styles.header}>
                <span>
                    {level.title}
                </span>
                {changed && (
                    <span className={styles.modifiedLabel}>
                        изменен
                    </span>
                )}
            </div>
            <span className={styles.path}>
                {level.path}
            </span>
        </div>
    );
}

export default Level;