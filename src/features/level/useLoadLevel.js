import {useEditor} from '../../shared/lib';
import {useCallback} from 'react';

export default function useLoadLevel() {
    let editor = useEditor();

    return useCallback(path => editor.loadLevel(path), [editor]);
}
