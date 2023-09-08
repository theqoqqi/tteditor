import {useCallback} from 'react';
import {SetMapOptionsPropertiesCommand, useEditor} from '../../../shared/lib';
import getPropertyValuesFromChanges from './getPropertyValuesFromChanges';

export default function useMapOptionsEditorCallback(mapOptions) {
    let editor = useEditor();

    return useCallback(changes => {
        let propertyValues = getPropertyValuesFromChanges(changes);

        editor.executeCommand(new SetMapOptionsPropertiesCommand(mapOptions, propertyValues));
    }, [editor, mapOptions]);
}