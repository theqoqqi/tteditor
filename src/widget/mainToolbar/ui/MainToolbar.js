import styles from './MainToolbar.module.css';
import React from 'react';
import {Toolbar, ToolbarGroup, ToolbarSeparator} from '../../../shared/ui';
import ResetLevelButton from './level/ResetLevelButton';
import SaveLevelButton from './level/SaveLevelButton';
import DownloadLevelButton from './level/DownloadLevelButton';
import {pointerModes} from '../../../entities/pointerMode';
import ToggleLayerButton from './toggleLayerButton/ToggleLayerButton';
import PointerModeButton from './pointerModeButton/PointerModeButton';
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
