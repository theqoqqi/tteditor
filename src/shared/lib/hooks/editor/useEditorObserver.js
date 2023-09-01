import useObserver from './useObserver';
import useEditor from './useEditor';

export default function useEditorObserver(propertyPath) {
    let editor = useEditor();

    return useObserver(editor, propertyPath);
}
