import styles from './WorkspaceEditor.module.css';
import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {ToolbarButton, ToolbarGroup} from '../../../../../shared/ui';

WorkspaceEditor.propTypes = {
    initialPath: PropTypes.string,
    onSave: PropTypes.func,
};

function WorkspaceEditor({ initialPath, onSave }) {
    let [inputPath, setInputPath] = useState(initialPath);

    return (
        <ToolbarGroup className={styles.workspaceEditor}>
            <input
                className={styles.input}
                value={inputPath}
                onChange={e => setInputPath(e.target.value)}
                style={{ width: (inputPath.length + 1) + 'ch' }}
            />
            <ToolbarButton onClick={() => onSave(inputPath)}>
                Сохранить
            </ToolbarButton>
        </ToolbarGroup>
    );
}

export default WorkspaceEditor;