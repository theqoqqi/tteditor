import styles from './CompactListItem.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

CompactListItem.propTypes = {
    itemRef: PropTypes.any,
    selected: PropTypes.bool,
    hidden: PropTypes.bool,
    onDoubleClick: PropTypes.func,
    children: PropTypes.any,
};

function CompactListItem({ itemRef, selected, hidden, onDoubleClick, children }) {
    return (
        <div
            ref={itemRef}
            className={classNames(styles.compactListItem, {
                [styles.selected]: selected,
                [styles.hidden]: hidden,
            })}
            onDoubleClick={onDoubleClick}
        >
            {children}
        </div>
    );
}

export default CompactListItem;