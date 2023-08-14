import {isHotkeyPressed, useHotkeys} from 'react-hotkeys-hook';

export default function useArrowMovement(selectedMapNodes) {

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

        for (const mapNode of selectedMapNodes) {
            mapNode.x += h * stepSize;
            mapNode.y += v * stepSize;
        }
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