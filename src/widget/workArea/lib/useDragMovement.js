import {usePointerMode} from '../../../entities/pointerMode';
import {useEditor, useEditorContext, MoveNodesCommand} from '../../../shared/lib';
import {useCallback, useState} from 'react';
import usePointerDrag from './usePointerDrag.js';

function position(x, y) {
    return { x, y };
}

export default function useDragMovement(selectedMapNodes) {
    let editor = useEditor();
    let editorContext = useEditorContext();
    let pointerMode = usePointerMode();
    let [dragStep, setDragStep] = useState(null);
    let [executedDrag, setExecutedDrag] = useState(null);

    let shouldStart = useCallback((startEventArgs) => {
        let [, { isSelected }] = startEventArgs;

        return isSelected;
    }, []);

    let onStart = useCallback(() => {
        setDragStep(editorContext.getMoveStepsForNodes(selectedMapNodes));
        setExecutedDrag(position(0, 0));
    }, [editorContext, selectedMapNodes]);

    let onMove = useCallback((dragState) => {
        let { totalDrag } = dragState;

        let alignedTotalDragX = Math.round(totalDrag.x / dragStep.x) * dragStep.x;
        let alignedTotalDragY = Math.round(totalDrag.y / dragStep.y) * dragStep.y;

        let moveByX = alignedTotalDragX - executedDrag.x;
        let moveByY = alignedTotalDragY - executedDrag.y;

        if (moveByX !== 0 || moveByY !== 0) {
            editor.executeCommand(new MoveNodesCommand(selectedMapNodes, moveByX, moveByY));

            setExecutedDrag(position(alignedTotalDragX, alignedTotalDragY));
        }
    }, [editor, selectedMapNodes, dragStep, executedDrag]);

    let onPointerDown = usePointerDrag({
        button: pointerMode.dragButton,
        shouldStart,
        onStart,
        onMove,
    });

    return onPointerDown;
}