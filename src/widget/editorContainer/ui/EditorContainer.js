import styles from './EditorContainer.module.css';
import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import useWorkspace from '../lib/useWorkspace.js';
import {useDispatch} from 'react-redux';
import {setWorkspacePath} from '../../../entities/editor';

EditorContainer.propTypes = {
    className: PropTypes.any,
    top: PropTypes.element,
    left: PropTypes.element,
    center: PropTypes.element,
    right: PropTypes.element,
    bottom: PropTypes.element,
};

function EditorContainer({ className, top, left, center, right, bottom }) {
    let { isLoading, error } = useWorkspace();
    let dispatch = useDispatch();

    useEffect(() => {
        dispatch(setWorkspacePath('test'));
    }, []);

    if (error) {
        return (
            <div>
                Не удалось загрузить рабочее пространство:
                {error?.message ?? error?.reason ?? JSON.stringify(error, null, 4)}
            </div>
        );
    }

    if (isLoading) {
        return <div>Загрузка рабочего пространства...</div>;
    }

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