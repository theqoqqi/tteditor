import styles from './WorkArea.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

WorkArea.propTypes = {
    className: PropTypes.any,
};

function WorkArea({ className }) {
    return (
        <div className={classNames(styles.workArea, className)}>

        </div>
    );
}

export default WorkArea;