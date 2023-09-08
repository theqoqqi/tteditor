import styles from './ControlContainer.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

ControlContainer.propTypes = {
    className: PropTypes.any,
    heading: PropTypes.any,
    children: PropTypes.any,
};

function ControlContainer({ className, heading, children }) {
    return (
        <div className={classNames(styles.controlContainer, className)}>
            {heading && (
                <div className={styles.heading}>
                    {heading}
                </div>
            )}
            <div className={styles.items}>
                {children}
            </div>
        </div>
    );
}

export default ControlContainer;