import styles from './WorkArea.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ScrollableMapContainer from './scrollableMapContainer/ScrollableMapContainer.js';

WorkArea.propTypes = {
    className: PropTypes.any,
};

function WorkArea({ className }) {
    return (
        <div className={classNames(styles.workArea, className)}>
            <ScrollableMapContainer />
        </div>
    );
}

export default WorkArea;