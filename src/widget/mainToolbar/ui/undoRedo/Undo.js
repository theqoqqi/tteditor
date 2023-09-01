import React, {useCallback} from 'react';
import {ToolbarIconButton} from '../../../../shared/ui';
import {BsArrowCounterclockwise} from 'react-icons/bs';
import {useEditorObserver, useObserver} from '../../../../shared/lib';

function Undo() {
    let commandExecutor = useEditorObserver('commandExecutor');
    let onClick = useCallback(() => {
        commandExecutor.undo();
    }, [commandExecutor]);

    useObserver(commandExecutor, 'version');

    let lastCommand = commandExecutor.lastExecutedCommand;
    let canUndo = lastCommand?.canUndo ?? false;

    return (
        <ToolbarIconButton
            title='Отменить последнее действие'
            icon={BsArrowCounterclockwise}
            disabled={!canUndo}
            onClick={onClick}
        />
    );
}

export default Undo;
