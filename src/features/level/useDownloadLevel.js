import {useEditor, useEditorContext, useMap} from '../../entities/editor';
import {xmlUtils} from '../../shared/lib';
import {useCallback} from 'react';

export default function useDownloadLevel() {
    let editor = useEditor();
    let editorContext = useEditorContext();
    let map = useMap();

    return useCallback(() => {
        let filename = editor.loadedLevelFilename;
        let levelXml = editorContext.writeLevel(map);

        xmlUtils.downloadXml(filename, levelXml);
    }, [editor, editorContext, map]);
}
