import styles from './WorkspaceView.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import {ToolbarGroup, ToolbarButton} from '../../../../../shared/ui';
import {useWorkspace} from '../../../../../entities/editor';

WorkspaceView.propTypes = {
    onEdit: PropTypes.func,
};

function WorkspaceView({ onEdit }) {
    let { path } = useWorkspace();

    return (
        <ToolbarGroup className={styles.workspaceView}>
            <span>
                Рабочее пространство:
            </span>
            <span>
                {path}
            </span>
            <ToolbarButton onClick={onEdit}>
                Изменить
            </ToolbarButton>
        </ToolbarGroup>
    );
}

export default WorkspaceView;