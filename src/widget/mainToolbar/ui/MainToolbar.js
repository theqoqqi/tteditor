import styles from './MainToolbar.module.css';
import React from 'react';
import {Toolbar, ToolbarGroup, ToolbarSeparator} from '../../../shared/ui';
import ResetLevelButton from './level/ResetLevelButton.js';
import SaveLevelButton from './level/SaveLevelButton.js';
import DownloadLevelButton from './level/DownloadLevelButton.js';
import {pointerModes} from '../../../entities/editor';
import ToggleLayerButton from './toggleLayerButton/ToggleLayerButton.js';
import PointerModeButton from './pointerModeButton/PointerModeButton.js';
import {EditorContext} from '../../../shared/lib';

function MainToolbar() {
    let layerTags = EditorContext.getLayerTagNames();

    return (
        <Toolbar className={styles.mainToolbar}>
            <ToolbarGroup>
                <ResetLevelButton />
                <SaveLevelButton />
                <DownloadLevelButton />
            </ToolbarGroup>
            <ToolbarSeparator />
            <ToolbarGroup>
                {Object.keys(pointerModes).map(mode => (
                    <PointerModeButton key={mode} mode={mode} />
                ))}
            </ToolbarGroup>
            <ToolbarSeparator />
            <ToolbarGroup>
                {layerTags.map(layerTag => (
                    <ToggleLayerButton key={layerTag} tag={layerTag} />
                ))}
            </ToolbarGroup>
        </Toolbar>
    );
}

export default MainToolbar;
