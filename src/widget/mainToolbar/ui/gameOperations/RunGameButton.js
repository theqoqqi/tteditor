import React from 'react';
import {BsPlayFill} from 'react-icons/bs';
import {useEditor} from '../../../../shared/lib';
import IconButton from '../iconButton/IconButton';
import {hotkeys} from '../../../../features/globalHotkeys';
import {useSelector} from 'react-redux';
import {selectWorkspacePath} from '../../../../entities/workspace';
import {useAsyncFn} from 'react-use';

function RunGameButton() {
    let editor = useEditor();
    let workspacePath = useSelector(selectWorkspacePath);
    let [{ loading }, onClick] = useAsyncFn(() => editor.runGame(), [editor]);

    return (
        <IconButton
            title='Запустить игру'
            hotkey={hotkeys.runGame}
            icon={BsPlayFill}
            onClick={onClick}
            disabled={!workspacePath || loading}
        />
    );
}

export default RunGameButton;