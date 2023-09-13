import React, {useCallback} from 'react';
import {BsPlayFill} from 'react-icons/bs';
import {useEditor} from '../../../../shared/lib';
import IconButton from '../iconButton/IconButton';
import {hotkeys} from '../../../../features/globalHotkeys';
import {useSelector} from 'react-redux';
import {selectWorkspacePath} from '../../../../entities/workspace';

function RunGameButton() {
    let editor = useEditor();
    let workspacePath = useSelector(selectWorkspacePath);
    let onClick = useCallback(() => editor.runGame(), [editor]);

    return (
        <IconButton
            title='Запустить игру'
            hotkey={hotkeys.runGame}
            icon={BsPlayFill}
            onClick={onClick}
            disabled={!workspacePath}
        />
    );
}

export default RunGameButton;