import styles from './WorkspaceView.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import {Button} from '../../../../../shared/ui';
import {useWorkspace} from '../../../../../entities/workspace';

WorkspaceView.propTypes = {
    onEdit: PropTypes.func,
};

function WorkspaceView({ onEdit }) {
    let { workspacePath } = useWorkspace();

    return (
        <div className={styles.workspaceView}>
            <span>
                {workspacePath}
            </span>
            <Button onClick={onEdit}>
                Изменить
            </Button>
        </div>
    );
}

export default WorkspaceView;