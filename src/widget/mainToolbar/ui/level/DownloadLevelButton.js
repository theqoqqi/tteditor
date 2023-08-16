import React from 'react';
import {ToolbarIconButton} from '../../../../shared/ui';
import {BsFileEarmarkArrowDownFill} from 'react-icons/bs';
import {useDownloadLevel} from '../../../../features/level';

function DownloadLevelButton() {
    let downloadLevel = useDownloadLevel();

    return (
        <ToolbarIconButton
            icon={BsFileEarmarkArrowDownFill}
            onClick={downloadLevel}
        />
    );
}

export default DownloadLevelButton;