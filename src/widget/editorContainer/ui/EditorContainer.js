import styles from './EditorContainer.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

EditorContainer.propTypes = {
    className: PropTypes.any,
    top: PropTypes.element,
    left: PropTypes.element,
    center: PropTypes.element,
    right: PropTypes.element,
    bottom: PropTypes.element,
};

function EditorContainer({ className, top, left, center, right, bottom }) {
    return (
        <div className={classNames(styles.editorContainer, className)}>
            {top}
            <div className={styles.middleRow}>
                {left}
                {center}
                {right}
            </div>
            {bottom}
        </div>
    );
}

export default EditorContainer;