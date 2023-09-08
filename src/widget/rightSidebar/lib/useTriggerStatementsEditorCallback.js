import {useCallback} from 'react';
import {SetTriggerPropertyCommand, useEditor} from '../../../shared/lib';

export default function useTriggerStatementsEditorCallback(trigger) {
    let editor = useEditor();

    return useCallback(e => {
        let text = e.target.value;

        if (!text) {
            return;
        }

        let statements = text.split('\n');

        editor.executeCommand(new SetTriggerPropertyCommand(trigger, 'statements', statements));
    }, [editor, trigger]);
}