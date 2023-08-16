import {isHotkeyPressed, useHotkeys} from 'react-hotkeys-hook';
import {MoveNodesCommand, useEditor, useEditorContext} from '../../../entities/editor';

export default function useArrowMovement(selectedMapNodes) {
    let editorContext = useEditorContext();
    let editor = useEditor();

    useHotkeys(
        'up, down, left, right',
        (e, handler) => moveMapNodes(selectedMapNodes, handler.keys),
        {
            ignoreModifiers: true,
        },
        [editorContext, selectedMapNodes]
    );

    function moveMapNodes(mapNodes, pressedKeys) {
        let h = pressedKeys.includes('right') - pressedKeys.includes('left');
        let v = pressedKeys.includes('down') - pressedKeys.includes('up');
        let { x, y, aligned } = editorContext.getMoveStepsForNodes(mapNodes);
        let stepSize = aligned ? 1 : getStepSize();

        let moveByX = h * x * stepSize;
        let moveByY = v * y * stepSize;

        editor.executeCommand(new MoveNodesCommand(selectedMapNodes, moveByX, moveByY));
    }

    function getStepSize() {
        let baseStepSize = 5;
        let stepSize = 1;

        if (isHotkeyPressed('shift')) {
            stepSize *= baseStepSize;
        }

        if (isHotkeyPressed('ctrl')) {
            stepSize *= baseStepSize;
        }

        if (!isHotkeyPressed('alt')) {
            stepSize *= baseStepSize;
        }

        return stepSize;
    }
}