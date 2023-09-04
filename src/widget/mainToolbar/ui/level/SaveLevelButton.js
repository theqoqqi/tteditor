import React from 'react';
import {BsFileEarmarkCheckFill} from 'react-icons/bs';
import {useSaveLevel} from '../../../../features/level';
import {useMap} from '../../../../shared/lib';
import IconButton from '../iconButton/IconButton';

function SaveLevelButton() {
    let map = useMap();
    let saveLevel = useSaveLevel();

    return (
        <IconButton
            title='Сохранить уровень'
            icon={BsFileEarmarkCheckFill}
            onClick={saveLevel}
            disabled={!map}
        />
    );
}

export default SaveLevelButton;