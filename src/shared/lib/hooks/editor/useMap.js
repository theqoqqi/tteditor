import useEditorObserver from './useEditorObserver';

export default function useMap() {
    // noinspection UnnecessaryLocalVariableJS
    /** @type GameMap */
    let map = useEditorObserver('levelEditor.map');

    return map;
}
