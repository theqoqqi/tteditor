import React, {useCallback} from 'react';
import {BsArrowClockwise} from 'react-icons/bs';
import {useEditorObserver, useListObserver, useObserver} from '../../../../shared/lib';
import IconButton from '../iconButton/IconButton';
import {hotkeys} from '../../../../features/globalHotkeys';

function RedoButton() {
    let commandExecutor = useEditorObserver('commandExecutor');
    let [commands] = useListObserver(commandExecutor, 'commands');
    let onClick = useCallback(() => {
        commandExecutor.redo();
    }, [commandExecutor]);

    useObserver(commandExecutor, 'version');

    let canRedo = commandExecutor.executedCommands < commands.length;

    return (
        <IconButton
            title='Повторить отмененное действие'
            hotkey={hotkeys.redo}
            icon={BsArrowClockwise}
            disabled={!canRedo}
            onClick={onClick}
        />
    );
}

export default RedoButton;
