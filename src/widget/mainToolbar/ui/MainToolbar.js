import styles from './MainToolbar.module.css';
import React from 'react';
import {Toolbar, ToolbarGroup} from '../../../shared/ui';
import ResetLevelButton from './level/ResetLevelButton.js';
import SaveLevelButton from './level/SaveLevelButton.js';
import DownloadLevelButton from './level/DownloadLevelButton.js';

function MainToolbar() {
    return (
        <Toolbar className={styles.mainToolbar}>
            <ToolbarGroup>
                <ResetLevelButton />
                <SaveLevelButton />
                <DownloadLevelButton />
            </ToolbarGroup>
        </Toolbar>
    );
}

export default MainToolbar;
