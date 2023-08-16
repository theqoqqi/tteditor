import React from 'react';
import {ToolbarIconButton} from '../../../../shared/ui';
import {BsFileEarmarkCheckFill} from 'react-icons/bs';
import {useSaveLevel} from '../../../../features/level';
import {useMap} from '../../../../entities/editor';

function SaveLevelButton() {
    let map = useMap();
    let saveLevel = useSaveLevel();

    return (
        <ToolbarIconButton
            title='Сохранить уровень'
            icon={BsFileEarmarkCheckFill}
            onClick={saveLevel}
            disabled={!map}
        />
    );
}

export default SaveLevelButton;