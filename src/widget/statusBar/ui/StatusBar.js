import styles from './StatusBar.module.css';
import React from 'react';
import {Toolbar} from '../../../shared/ui';
import WorkspaceStatus from './workspaceStatus/WorkspaceStatus.js';

function StatusBar() {
    return (
        <Toolbar className={styles.statusBar}>
            <WorkspaceStatus />
        </Toolbar>
    );
}

export default StatusBar;
