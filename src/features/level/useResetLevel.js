import {useEditor} from '../../entities/editor';
import {useCallback} from 'react';

export default function useResetLevel() {
    let editor = useEditor();

    return useCallback(() => editor.loadLevel(editor.loadedLevelPath), [editor]);
}
