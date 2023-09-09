import React, {useCallback} from 'react';
import {BsArrowCounterclockwise} from 'react-icons/bs';
import {useEditorObserver, useObserver} from '../../../../shared/lib';
import IconButton from '../iconButton/IconButton';
import {hotkeys} from '../../../../features/globalHotkeys';

function UndoButton() {
    let commandExecutor = useEditorObserver('commandExecutor');
    let onClick = useCallback(() => {
        commandExecutor.undo();
    }, [commandExecutor]);

    useObserver(commandExecutor, 'version');

    let lastCommand = commandExecutor.lastExecutedCommand;
    let canUndo = lastCommand?.canUndo ?? false;

    return (
        <IconButton
            title='Отменить последнее действие'
            hotkey={hotkeys.undo}
            icon={BsArrowCounterclockwise}
            disabled={!canUndo}
            onClick={onClick}
        />
    );
}

export default UndoButton;
