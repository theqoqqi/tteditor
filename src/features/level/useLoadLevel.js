import {useEditor} from '../../entities/editor';
import {useCallback} from 'react';

export default function useLoadLevel() {
    let editor = useEditor();

    return useCallback(path => editor.loadLevel(path), [editor]);
}
