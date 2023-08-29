import {SetTerrainCommand, useEditor, useEditorContext, useMap} from '../../../../shared/lib';
import {useCallback} from 'react';

export default function useOnSelectPaletteItem(nodeMetadata) {
    let editor = useEditor();
    let editorContext = useEditorContext();
    let map = useMap();
    let onSelect = useCallback(async () => {
        if (!map) {
            return;
        }

        let tag = nodeMetadata.tagName;

        if (tag === 'terrain') {
            let terrainName = nodeMetadata.getAttribute('name');
            let terrain = await editorContext.createTerrainByName(terrainName);

            editor.executeCommand(new SetTerrainCommand(map, terrain));
        } else {

        }
    }, [editor, editorContext, map, nodeMetadata]);

    return onSelect;
}
