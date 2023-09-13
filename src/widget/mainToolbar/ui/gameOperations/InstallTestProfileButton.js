import React from 'react';
import {BsPersonFillUp} from 'react-icons/bs';
import {useEditor} from '../../../../shared/lib';
import IconButton from '../iconButton/IconButton';
import {hotkeys} from '../../../../features/globalHotkeys';
import {useSelector} from 'react-redux';
import {selectWorkspacePath} from '../../../../entities/workspace';
import {useAsyncFn} from 'react-use';

function RunButton() {
    let editor = useEditor();
    let workspacePath = useSelector(selectWorkspacePath);
    let [{ loading }, onClick] = useAsyncFn(() => editor.installTestProfile(), [editor]);

    return (
        <IconButton
            title='Установить тестовый профиль'
            hotkey={hotkeys.installTestProfile}
            icon={BsPersonFillUp}
            onClick={onClick}
            disabled={!workspacePath || loading}
        />
    );
}

export default RunButton;