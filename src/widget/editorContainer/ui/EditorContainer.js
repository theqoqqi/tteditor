import styles from './EditorContainer.module.css';
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {useEditorContext} from '../../../entities/editor';

EditorContainer.propTypes = {
    className: PropTypes.any,
    top: PropTypes.element,
    left: PropTypes.element,
    center: PropTypes.element,
    right: PropTypes.element,
    bottom: PropTypes.element,
};

function EditorContainer({ className, top, left, center, right, bottom }) {
    let editorContext = useEditorContext();
    let [loaded, setLoaded] = useState(false);

    useEffect(() => {
        (async () => {
            await editorContext.setWorkspacePath('test');
            await editorContext.reloadDataFromServer();
            setLoaded(true);
        })();
    }, []);

    if (!loaded) {
        return <div>Загрузка...</div>;
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