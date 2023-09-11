import styles from './EditorContainer.module.css';
import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {useDispatch, useSelector} from 'react-redux';
import {selectWorkspacePath, setWorkspacePath} from '../../../entities/workspace';
import {useGlobalHotkeys} from '../../../features/globalHotkeys';

EditorContainer.propTypes = {
    className: PropTypes.any,
    top: PropTypes.element,
    left: PropTypes.element,
    center: PropTypes.element,
    right: PropTypes.element,
    bottom: PropTypes.element,
};

function EditorContainer({ className, top, left, center, right, bottom }) {
    let workspacePath = useSelector(selectWorkspacePath);
    let dispatch = useDispatch();

    useEffect(() => {
        let workspaceToLoad = localStorage.getItem('workspacePath') ?? 'test';

        dispatch(setWorkspacePath(workspaceToLoad));
    }, [dispatch]);

    useEffect(() => {
        localStorage.setItem('workspacePath', workspacePath);
    }, [workspacePath]);

    useGlobalHotkeys();

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