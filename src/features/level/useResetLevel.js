import {useEditor} from '../../shared/lib';
import {useCallback} from 'react';

export default function useResetLevel() {
    let editor = useEditor();

    return useCallback(() => editor.reloadCurrentLevel(), [editor]);
}
