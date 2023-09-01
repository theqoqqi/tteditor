import styles from './Command.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import {AbstractCommand, getCommandIconComponent} from '../../../../../shared/lib';
import classNames from 'classnames';

Command.propTypes = {
    command: PropTypes.instanceOf(AbstractCommand),
    selected: PropTypes.bool,
    executed: PropTypes.bool,
};

function Command({ command, selected, executed }) {
    let IconComponent = getCommandIconComponent(command);

    return (
        <div
            className={classNames(styles.command, {
                [styles.selected]: selected,
                [styles.executed]: executed,
            })}
        >
            <IconComponent className={styles.icon} size={16} />
            <span className={styles.title}>
                {command.title}
            </span>
        </div>
    );
}

export default Command;