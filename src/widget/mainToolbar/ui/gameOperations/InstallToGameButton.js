import React from 'react';
import {BsFillCaretUpSquareFill} from 'react-icons/bs';
import {useEditor} from '../../../../shared/lib';
import IconButton from '../iconButton/IconButton';
import {hotkeys} from '../../../../features/globalHotkeys';
import {useSelector} from 'react-redux';
import {selectWorkspacePath} from '../../../../entities/workspace';
import {useAsyncFn} from 'react-use';

function RunButton() {
    let editor = useEditor();
    let workspacePath = useSelector(selectWorkspacePath);
    let [{ loading }, onClick] = useAsyncFn(() => editor.installToGame(), [editor]);

    return (
        <IconButton
            title='Установить в игру'
            hotkey={hotkeys.installToGame}
            icon={BsFillCaretUpSquareFill}
            onClick={onClick}
            disabled={!workspacePath || loading}
        />
    );
}

export default RunButton;