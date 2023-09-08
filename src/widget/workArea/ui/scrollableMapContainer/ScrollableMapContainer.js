import styles from './ScrollableMapContainer.module.css';
import React, {useEffect, useRef} from 'react';
import ScrollContainer from 'react-indiana-drag-scroll';
import {usePointerMode} from '../../../../entities/pointerMode';
import {useMap, useMapObserver, useObserver} from '../../../../shared/lib';
import MapContainer from '../mapContainer/MapContainer';
import {useSelector} from 'react-redux';
import {selectCameraFocusPosition} from '../../../../entities/focus';
import FowClear from './fowClear/FowClear';

function ScrollableMapContainer() {
    /** @type React.Ref<HTMLElement> */
    let ref = useRef();
    /** @type React.Ref<HTMLDivElement> */
    let overscrollRef = useRef();
    let map = useMap();
    let options = useMapObserver('options') ?? null;
    let pointerMode = usePointerMode();
    let focusPosition = useSelector(selectCameraFocusPosition);
    let fowClearColor = useObserver(options, 'fowClearColor');

    useEffect(() => {
        if (focusPosition) {
            focusCameraAtPosition(focusPosition);
        }

        function focusCameraAtPosition({ x, y }) {
            let width = ref.current.offsetWidth;
            let height = ref.current.offsetHeight;
            let padding = getPadding();
            let centeredX = x - width / 2 + padding;
            let centeredY = y - height / 2 + padding;

            ref.current.scrollTo(centeredX, centeredY);
        }

        function getPadding() {
            let computedStyle = getComputedStyle(overscrollRef.current);
            let padding = computedStyle.getPropertyValue('padding');

            return parseInt(padding);
        }
    }, [focusPosition]);

    return (
        <ScrollContainer
            innerRef={ref}
            className={styles.scrollableMapContainer}
            buttons={pointerMode.scrollButtons}
            style={{
                cursor: pointerMode.cursor,
            }}
        >
            <div ref={overscrollRef} className={styles.overscrollArea}>
                {map && <MapContainer />}
            </div>
            <FowClear color={fowClearColor} />
        </ScrollContainer>
    );
}

export default ScrollableMapContainer;