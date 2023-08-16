import React from 'react';
import {ToolbarIconButton} from '../../../../shared/ui';
import {BsFileEarmarkCheckFill} from 'react-icons/bs';
import {useSaveLevel} from '../../../../features/level';

function SaveLevelButton() {
    let saveLevel = useSaveLevel();

    return (
        <ToolbarIconButton
            icon={BsFileEarmarkCheckFill}
            onClick={saveLevel}
        />
    );
}

export default SaveLevelButton;