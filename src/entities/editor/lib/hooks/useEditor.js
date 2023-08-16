import {useContext} from 'react';
import Context from './../context.js';

export default function useEditor() {
    // noinspection UnnecessaryLocalVariableJS
    /** @type Editor */
    let editor = useContext(Context);

    return editor;
}
