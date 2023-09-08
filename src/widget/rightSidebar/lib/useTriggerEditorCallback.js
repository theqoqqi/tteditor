import {useCallback} from 'react';
import {SetTriggerPropertyCommand, useEditor} from '../../../shared/lib';

export default function useTriggerEditorCallback(trigger) {
    let editor = useEditor();

    return useCallback(([{ property, newValue }]) => {
        editor.executeCommand(new SetTriggerPropertyCommand(trigger, property.name, newValue));
    }, [editor, trigger]);
}