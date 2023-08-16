import React from 'react';
import {ToolbarIconButton} from '../../../../shared/ui';
import {BsFileEarmarkArrowDownFill} from 'react-icons/bs';
import {useDownloadLevel} from '../../../../features/level';
import {useEditor} from '../../../../entities/editor';

function DownloadLevelButton() {
    let editor = useEditor();
    let downloadLevel = useDownloadLevel();

    function onClick() {
        let path = editor.loadedLevelPath;

        downloadLevel();

        alert(`В игре файл должен храниться здесь:\nИГРА/${path}`);
    }

    return (
        <ToolbarIconButton
            icon={BsFileEarmarkArrowDownFill}
            onClick={onClick}
        />
    );
}

export default DownloadLevelButton;