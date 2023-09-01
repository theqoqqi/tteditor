import {useContext} from 'react';
import Context from '../../context/context';

export default function useEditorContext() {
    // noinspection UnnecessaryLocalVariableJS
    /** @type Editor */
    let editor = useContext(Context);

    return editor.context;
}
