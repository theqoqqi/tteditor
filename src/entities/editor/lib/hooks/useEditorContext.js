import {useContext} from 'react';
import Context from './../context.js';

export default function useEditorContext() {
    // noinspection UnnecessaryLocalVariableJS
    /** @type Editor */
    let editor = useContext(Context);

    return editor.context;
}
