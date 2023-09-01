import React, {useCallback} from 'react';
import {ToolbarIconButton} from '../../../../shared/ui';
import {BsArrowClockwise} from 'react-icons/bs';
import {useEditorObserver, useListObserver, useObserver} from '../../../../shared/lib';

function Redo() {
    let commandExecutor = useEditorObserver('commandExecutor');
    let [commands] = useListObserver(commandExecutor, 'commands');
    let onClick = useCallback(() => {
        commandExecutor.redo();
    }, [commandExecutor]);

    useObserver(commandExecutor, 'version');

    let canRedo = commandExecutor.executedCommands < commands.length;

    return (
        <ToolbarIconButton
            title='Повторить отмененное действие'
            icon={BsArrowClockwise}
            disabled={!canRedo}
            onClick={onClick}
        />
    );
}

export default Redo;
