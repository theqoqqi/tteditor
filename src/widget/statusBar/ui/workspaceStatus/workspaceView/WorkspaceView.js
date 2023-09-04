import styles from './WorkspaceView.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import {ToolbarButton} from '../../../../../shared/ui';
import {useWorkspace} from '../../../../../entities/workspace';

WorkspaceView.propTypes = {
    onEdit: PropTypes.func,
};

function WorkspaceView({ onEdit }) {
    let { workspacePath } = useWorkspace();

    return (
        <div className={styles.workspaceView}>
            <span>
                Рабочее пространство:
            </span>
            <span>
                {workspacePath}
            </span>
            <ToolbarButton onClick={onEdit}>
                Изменить
            </ToolbarButton>
        </div>
    );
}

export default WorkspaceView;