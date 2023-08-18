import styles from './WorkspaceStatus.module.css';
import React, {useState} from 'react';
import {ToolbarGroup} from '../../../../shared/ui';
import {setWorkspacePath, useWorkspace} from '../../../../entities/editor';
import WorkspaceEditor from './workspaceEditor/WorkspaceEditor.js';
import WorkspaceView from './workspaceView/WorkspaceView.js';
import {useDispatch} from 'react-redux';

const EDIT_MODE = 'EDIT_MODE';
const VIEW_MODE = 'VIEW_MODE';

function WorkspaceStatus() {
    let [mode, setMode] = useState(VIEW_MODE);
    let dispatch = useDispatch();
    let { path, loadingPath, isLoading } = useWorkspace();

    let isInViewMode = !isLoading && mode === VIEW_MODE;
    let isInEditMode = !isLoading && mode === EDIT_MODE;

    function onEdit() {
        setMode(EDIT_MODE);
    }

    function onSave(path) {
        dispatch(setWorkspacePath(path));

        setMode(VIEW_MODE);
    }

    return (
        <ToolbarGroup className={styles.workspaceStatus}>
            {isLoading && `Загрузка: ${loadingPath}`}
            {isInViewMode && <WorkspaceView onEdit={onEdit} />}
            {isInEditMode && <WorkspaceEditor initialPath={path} onSave={onSave} />}
        </ToolbarGroup>
    );
}

export default WorkspaceStatus;