import styles from './CommandListTab.module.css';
import React, {useCallback} from 'react';
import {List} from '../../../../shared/ui';
import {useEditorObserver, useListObserver, useObserver} from '../../../../shared/lib';
import Command from './command/Command';

function CommandListTab() {
    let commandExecutor = useEditorObserver('commandExecutor');
    let [commands] = useListObserver(commandExecutor, 'commands');
    let onSelect = useCallback(command => {
        commandExecutor.rewindTo(command);
    }, [commandExecutor]);

    useObserver(commandExecutor, 'version');

    return (
        <List
            className={styles.levelList}
            itemClassName='p-0 border-0'
            items={[...commands].reverse()}
            selectedItem={commandExecutor.lastExecutedCommand}
            onSelect={onSelect}
            keyBy={command => command?.editorId}
            compareBy={command => command?.editorId}
            listItemContent={(command, index, isSelected) => (
                <Command
                    command={command}
                    selected={isSelected}
                    executed={commandExecutor.isExecuted(command)}
                />
            )}
        />
    );
}

export default CommandListTab;