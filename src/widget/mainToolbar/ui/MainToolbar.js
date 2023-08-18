import styles from './MainToolbar.module.css';
import React from 'react';
import {Toolbar, ToolbarGroup, ToolbarSeparator} from '../../../shared/ui';
import ResetLevelButton from './level/ResetLevelButton.js';
import SaveLevelButton from './level/SaveLevelButton.js';
import DownloadLevelButton from './level/DownloadLevelButton.js';
import {pointerModes, useEditorContext} from '../../../entities/editor';
import ToggleLayerButton from './toggleLayerButton/ToggleLayerButton.js';
import PointerModeButton from './pointerModeButton/PointerModeButton.js';

function MainToolbar() {
    let editorContext = useEditorContext();
    let layerTags = editorContext.getLayerTagNames();

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
