import {useEditor, useEditorContext, useMap} from '../../entities/editor';
import {downloadXml} from '../../entities/editor/core/util/xml.js';
import {useCallback} from 'react';

export default function useDownloadLevel() {
    let editor = useEditor();
    let editorContext = useEditorContext();
    let map = useMap();

    return useCallback(() => {
        let filename = editor.loadedLevelFilename;
        let levelXml = editorContext.writeLevel(map);

        downloadXml(filename, levelXml);
    }, [editor, editorContext, map]);
}
