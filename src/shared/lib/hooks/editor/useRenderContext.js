import {useContext} from 'react';
import Context from '../../context/context.js';

export default function useRenderContext() {
    // noinspection UnnecessaryLocalVariableJS
    /** @type Editor */
    let editor = useContext(Context);

    return editor.renderContext;
}
