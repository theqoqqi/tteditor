import {useCallback} from 'react';
import {SetTriggerPropertyCommand, useEditor} from '../../../shared/lib';

export default function useTriggerStatementsEditorCallback(trigger) {
    let editor = useEditor();

    return useCallback(newValue => {
        let statements = newValue.split('\n');

        editor.executeCommand(new SetTriggerPropertyCommand(trigger, 'statements', statements));
    }, [editor, trigger]);
}