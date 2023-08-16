import React from 'react';
import {ToolbarIconButton} from '../../../../shared/ui';
import {BsFileEarmarkXFill} from 'react-icons/bs';
import {useResetLevel} from '../../../../features/level';

function ResetLevelButton() {
    let resetLevel = useResetLevel();

    function onClick() {
        if (window.confirm('Сбросить все несохраненные изменения?')) {
            resetLevel();
        }
    }

    return (
        <ToolbarIconButton
            icon={BsFileEarmarkXFill}
            onClick={onClick}
        />
    );
}

export default ResetLevelButton;