import styles from './StatusBar.module.css';
import React from 'react';
import WorkspaceStatus from './workspaceStatus/WorkspaceStatus';
import Separator from './separator/Separator';
import PointerStatus from './pointerStatus/PointerStatus';

function StatusBar() {
    return (
        <div className={styles.statusBar}>
            <PointerStatus />
            <Separator />
            <WorkspaceStatus />
        </div>
    );
}

export default StatusBar;
