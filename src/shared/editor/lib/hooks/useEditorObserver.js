import useObserver from './useObserver.js';
import useEditor from './useEditor.js';

export default function useEditorObserver(propertyPath) {
    let editor = useEditor();

    return useObserver(editor, propertyPath);
}
