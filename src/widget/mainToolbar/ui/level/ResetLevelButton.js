import React from 'react';
import {ToolbarIconButton} from '../../../../shared/ui';
import {BsFileEarmarkXFill} from 'react-icons/bs';
import {useResetLevel} from '../../../../features/level';
import {useMap} from '../../../../entities/editor';

function ResetLevelButton() {
    let map = useMap();
    let resetLevel = useResetLevel();

    function onClick() {
        if (window.confirm('Сбросить все несохраненные изменения?')) {
            resetLevel();
        }
    }

    return (
        <ToolbarIconButton
            title='Перезагрузить уровень'
            icon={BsFileEarmarkXFill}
            onClick={onClick}
            disabled={!map}
        />
    );
}

export default ResetLevelButton;