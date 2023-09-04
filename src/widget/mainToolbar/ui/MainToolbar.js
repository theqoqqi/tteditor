import styles from './MainToolbar.module.css';
import React from 'react';
import {ToolbarGroup} from '../../../shared/ui';
import ResetLevelButton from './level/ResetLevelButton';
import SaveLevelButton from './level/SaveLevelButton';
import DownloadLevelButton from './level/DownloadLevelButton';
import {pointerModes} from '../../../entities/pointerMode';
import ToggleLayerButton from './toggleLayerButton/ToggleLayerButton';
import PointerModeButton from './pointerModeButton/PointerModeButton';
import {EditorContext} from '../../../shared/lib';
import Undo from './undoRedo/Undo';
import Redo from './undoRedo/Redo';
import Separator from './separator/Separator';

function MainToolbar() {
    let layerTags = EditorContext.getLayerTagNames();

    return (
        <div className={styles.mainToolbar}>
            <ToolbarGroup>
                <ResetLevelButton />
                <SaveLevelButton />
                <DownloadLevelButton />
            </ToolbarGroup>
            <Separator />
            <ToolbarGroup>
                <Undo />
                <Redo />
            </ToolbarGroup>
            <Separator />
            <ToolbarGroup>
                {Object.keys(pointerModes).map(mode => (
                    <PointerModeButton key={mode} mode={mode} />
                ))}
            </ToolbarGroup>
            <Separator />
            <ToolbarGroup>
                {layerTags.map(layerTag => (
                    <ToggleLayerButton key={layerTag} tag={layerTag} />
                ))}
            </ToolbarGroup>
        </div>
    );
}

export default MainToolbar;
