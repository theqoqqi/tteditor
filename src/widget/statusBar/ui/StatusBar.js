import styles from './StatusBar.module.css';
import React from 'react';
import WorkspaceStatus from './workspaceStatus/WorkspaceStatus';

function StatusBar() {
    return (
        <div className={styles.statusBar}>
            <WorkspaceStatus />
        </div>
    );
}

export default StatusBar;
