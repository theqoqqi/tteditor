import {useEditor} from '../../entities/editor';
import {useCallback} from 'react';

export default function useSaveLevel() {
    let editor = useEditor();

    return useCallback(() => editor.saveCurrentLevel(), [editor]);
}
