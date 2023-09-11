import React, {useCallback} from 'react';
import {BsPlayFill} from 'react-icons/bs';
import {useEditor} from '../../../../shared/lib';
import IconButton from '../iconButton/IconButton';
import {hotkeys} from '../../../../features/globalHotkeys';
import {useSelector} from 'react-redux';
import {selectWorkspacePath} from '../../../../entities/workspace';

function RunButton() {
    let editor = useEditor();
    let workspacePath = useSelector(selectWorkspacePath);
    let installAndRun = useCallback(() => editor.installAndRun(), [editor]);

    return (
        <IconButton
            title='Установить и запустить игру'
            hotkey={hotkeys.run}
            icon={BsPlayFill}
            onClick={installAndRun}
            disabled={!workspacePath}
        />
    );
}

export default RunButton;