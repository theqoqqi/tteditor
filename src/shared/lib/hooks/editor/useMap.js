import useEditorObserver from './useEditorObserver.js';

export default function useMap() {
    // noinspection UnnecessaryLocalVariableJS
    /** @type GameMap */
    let map = useEditorObserver('levelEditor.map');

    return map;
}
