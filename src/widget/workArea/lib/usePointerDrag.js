import {useCallback, useEffect, useState} from 'react';

function positionFromEvent(e) {
    return {
        x: e.clientX,
        y: e.clientY,
    };
}

export default function usePointerDrag({ button, shouldStart, onStart, onMove, onFinish }) {
    let [dragState, setDragState] = useState(null);
    let [startEventArgs, setStartEventArgs] = useState(null);



    let onPointerDown = useCallback((...args) => {
        setStartEventArgs([...args]);
    }, []);

    useEffect(() => {
        if (!startEventArgs) {
            return;
        }

        let [e] = startEventArgs;

        if (e.button === button && shouldStart(startEventArgs)) {
            setDragState({
                start: positionFromEvent(e),
                mouse: positionFromEvent(e),
                totalDrag: { x: 0, y: 0 },
            });
            onStart(startEventArgs);
        }
    }, [startEventArgs, button, shouldStart, onStart]);



    let onPointerMove = useCallback(e => {
        if (dragState) {
            setDragState(state => {
                let mouse = positionFromEvent(e);
                let totalDrag = {
                    x: mouse.x - state.start.x,
                    y: mouse.y - state.start.y,
                };

                return {
                    ...state,
                    totalDrag,
                    mouse,
                };
            });
        }
    }, [dragState]);

    useEffect(() => {
        if (dragState) {
            onMove(dragState);
        }
    }, [dragState, onMove]);



    let onPointerUp = useCallback(() => {
        if (dragState) {
            setDragState(null);
            setStartEventArgs(null);

            onFinish?.();
        }
    }, [dragState, onFinish]);



    useEffect(() => {
        document.addEventListener('pointermove', onPointerMove);
        document.addEventListener('pointerup', onPointerUp);

        return () => {
            document.removeEventListener('pointermove', onPointerMove);
            document.removeEventListener('pointerup', onPointerUp);
        };
    }, [onPointerMove, onPointerUp]);



    return onPointerDown;
}