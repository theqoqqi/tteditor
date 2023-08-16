import React from 'react';
import {ToolbarIconButton} from '../../../../shared/ui';
import {BsFileEarmarkXFill} from 'react-icons/bs';
import {useResetLevel} from '../../../../features/level';

function ResetLevelButton() {
    let resetLevel = useResetLevel();

    return (
        <ToolbarIconButton
            icon={BsFileEarmarkXFill}
            onClick={resetLevel}
        />
    );
}

export default ResetLevelButton;