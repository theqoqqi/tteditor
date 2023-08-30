import {SetTerrainCommand, useEditor, useEditorContext, useMap} from '../../../../shared/lib';
import {useCallback} from 'react';

export default function useOnSelectPaletteItem(tag, type) {
    let editor = useEditor();
    let editorContext = useEditorContext();
    let map = useMap();
    let onSelect = useCallback(async () => {
        if (!map) {
            return;
        }

        if (tag === 'terrain') {
            let terrain = await editorContext.createTerrainByName(type);

            editor.executeCommand(new SetTerrainCommand(map, terrain));
        } else {

        }
    }, [editor, editorContext, map]);

    return onSelect;
}
