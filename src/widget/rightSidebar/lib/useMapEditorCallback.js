import {useCallback} from 'react';
import {SetMapPropertiesCommand, useEditor} from '../../../shared/lib';
import getPropertyValuesFromChanges from './getPropertyValuesFromChanges';

export default function useMapEditorCallback(map) {
    let editor = useEditor();

    return useCallback(changes => {
        let propertyValues = getPropertyValuesFromChanges(changes);

        editor.executeCommand(new SetMapPropertiesCommand(map, propertyValues));
    }, [editor, map]);
}