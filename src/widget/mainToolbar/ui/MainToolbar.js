import styles from './MainToolbar.module.css';
import React from 'react';
import ResetLevelButton from './level/ResetLevelButton';
import SaveLevelButton from './level/SaveLevelButton';
import DownloadLevelButton from './level/DownloadLevelButton';
import {pointerModes} from '../../../entities/pointerMode';
import ToggleLayerButton from './toggleLayerButton/ToggleLayerButton';
import PointerModeButton from './pointerModeButton/PointerModeButton';
import {EditorContext} from '../../../shared/lib';
import UndoButton from './undoRedo/UndoButton';
import RedoButton from './undoRedo/RedoButton';
import Separator from './separator/Separator';

function MainToolbar() {
    let layerTags = EditorContext.getLayerTagNames();

    return (
        <div className={styles.mainToolbar}>
            <>
                <ResetLevelButton />
                <SaveLevelButton />
                <DownloadLevelButton />
            </>
            <Separator />
            <>
                <UndoButton />
                <RedoButton />
            </>
            <Separator />
            <>
                {Object.keys(pointerModes).map(mode => (
                    <PointerModeButton key={mode} mode={mode} />
                ))}
            </>
            <Separator />
            <>
                {layerTags.map(layerTag => (
                    <ToggleLayerButton key={layerTag} tag={layerTag} />
                ))}
            </>
        </div>
    );
}

export default MainToolbar;
