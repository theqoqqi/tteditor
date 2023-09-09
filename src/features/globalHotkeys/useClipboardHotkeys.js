import {useHotkeys} from 'react-hotkeys-hook';
import {xmlUtils} from '../../shared/lib';
import {setBrushMapNodes} from '../../entities/brush';
import {pointerModes, setPointerMode} from '../../entities/pointerMode';
import {useDispatch, useSelector} from 'react-redux';
import {selectSelectedMapNodes} from '../../entities/selection';
import {useCopyToClipboard} from 'react-use';
import MapReader from '../../shared/lib/editor/MapReader';
import MapWriter from '../../shared/lib/editor/MapWriter';
import {useCallback} from 'react';
import hotkeys from './hotkeys';
import {useRemoveMapNodes} from '../node';

function serializeMapNodes(mapNodes) {
    let xmlSerializer = new XMLSerializer();
    let mapWriter = new MapWriter();

    mapWriter.init();

    let serializedXml = mapNodes
        .map(mapNode => mapWriter.createElementFromNode(mapNode))
        .map(element => xmlSerializer.serializeToString(element))
        .join('\n');

    return xmlUtils.reformatXml(serializedXml);
}

function deserializeMapNodes(xmlText) {
    let domParser = new DOMParser();
    let xmlDocument = domParser.parseFromString(`<root>${xmlText}</root>`, 'text/xml');
    let mapNodeXmlElements = xmlDocument.querySelectorAll(`:scope > *`);

    return Array.from(mapNodeXmlElements).map(element => {
        return MapReader.createNodeFromElement(element);
    });
}

function centerMapNodes(mapNodes) {
    let averageFunc = (array, propertyName) => {
        let sum = array.reduce((previous, mapNode) => {
            return previous + mapNode[propertyName];
        }, 0);

        return sum / array.length;
    };

    let centerX = averageFunc(mapNodes, 'x');
    let centerY = averageFunc(mapNodes, 'y');

    mapNodes.forEach(mapNode => {
        mapNode.x -= Math.round(centerX);
        mapNode.y -= Math.round(centerY);
    });

    return mapNodes;
}

function withPreventDefault(callback) {
    return e => {
        e.preventDefault();
        callback();
    };
}

export default function useClipboardHotkeys() {
    let selectedMapNodes = useSelector(selectSelectedMapNodes);
    let dispatch = useDispatch();
    let [clipboardState, copyToClipboard] = useCopyToClipboard();
    let removeMapNodes = useRemoveMapNodes();

    let cut = useCallback(() => {
        removeMapNodes(selectedMapNodes);
        copyToClipboard(serializeMapNodes(selectedMapNodes));
    }, [removeMapNodes, copyToClipboard, selectedMapNodes]);

    let copy = useCallback(() => {
        copyToClipboard(serializeMapNodes(selectedMapNodes));
    }, [copyToClipboard, selectedMapNodes]);

    let paste = useCallback(() => {
        let mapNodes = deserializeMapNodes(clipboardState.value);
        let centeredMapNodes = centerMapNodes(mapNodes);

        if (mapNodes.length) {
            dispatch(setBrushMapNodes(centeredMapNodes));
            dispatch(setPointerMode(pointerModes.insert.name));
        }
    }, [dispatch, clipboardState.value]);

    useHotkeys(hotkeys.cut, withPreventDefault(cut));
    useHotkeys(hotkeys.copy, withPreventDefault(copy));
    useHotkeys(hotkeys.paste, withPreventDefault(paste));
}
