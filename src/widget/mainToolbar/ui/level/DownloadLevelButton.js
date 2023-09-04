import React from 'react';
import {BsFileEarmarkArrowDownFill} from 'react-icons/bs';
import {useDownloadLevel} from '../../../../features/level';
import {useEditor, useMap} from '../../../../shared/lib';
import IconButton from '../iconButton/IconButton';

function DownloadLevelButton() {
    let editor = useEditor();
    let map = useMap();
    let downloadLevel = useDownloadLevel();

    function onClick() {
        let path = editor.loadedLevelPath;

        downloadLevel();

        alert(`В игре файл должен храниться здесь:\nИГРА/${path}`);
    }

    return (
        <IconButton
            title='Скачать уровень'
            icon={BsFileEarmarkArrowDownFill}
            onClick={onClick}
            disabled={!map}
        />
    );
}

export default DownloadLevelButton;