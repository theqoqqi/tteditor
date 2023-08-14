import {isHotkeyPressed, useHotkeys} from 'react-hotkeys-hook';
import {MoveNodesCommand, useEditor} from '../../../shared/editor';

export default function useArrowMovement(selectedMapNodes) {
    let editor = useEditor();

    useHotkeys(
        'up, down, left, right',
        (e, handler) => moveMapNodes(selectedMapNodes, handler.keys),
        {
            ignoreModifiers: true,
        },
        [selectedMapNodes]
    );

    function moveMapNodes(mapNodes, pressedKeys) {
        let h = pressedKeys.includes('right') - pressedKeys.includes('left');
        let v = pressedKeys.includes('down') - pressedKeys.includes('up');
        let stepSize = getStepSize();

        let command = new MoveNodesCommand(selectedMapNodes, h * stepSize, v * stepSize);

        editor.executeCommand(command);
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