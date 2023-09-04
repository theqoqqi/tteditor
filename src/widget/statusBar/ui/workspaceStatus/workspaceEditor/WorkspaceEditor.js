import styles from './WorkspaceEditor.module.css';
import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Button} from '../../../../../shared/ui';

WorkspaceEditor.propTypes = {
    initialPath: PropTypes.string,
    onSave: PropTypes.func,
};

function WorkspaceEditor({ initialPath, onSave }) {
    let [inputPath, setInputPath] = useState(initialPath);

    return (
        <div className={styles.workspaceEditor}>
            <input
                className={styles.input}
                value={inputPath}
                onChange={e => setInputPath(e.target.value)}
                style={{ width: (inputPath.length + 1) + 'ch' }}
            />
            <Button onClick={() => onSave(inputPath)}>
                Сохранить
            </Button>
        </div>
    );
}

export default WorkspaceEditor;