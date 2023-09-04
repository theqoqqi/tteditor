import React from 'react';
import {BsFileEarmarkXFill} from 'react-icons/bs';
import {useResetLevel} from '../../../../features/level';
import {useMap} from '../../../../shared/lib';
import IconButton from '../iconButton/IconButton';

function ResetLevelButton() {
    let map = useMap();
    let resetLevel = useResetLevel();

    function onClick() {
        if (window.confirm('Сбросить все несохраненные изменения?')) {
            resetLevel();
        }
    }

    return (
        <IconButton
            title='Перезагрузить уровень'
            icon={BsFileEarmarkXFill}
            onClick={onClick}
            disabled={!map}
        />
    );
}

export default ResetLevelButton;