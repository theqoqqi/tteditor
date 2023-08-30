import {useState} from 'react';
import {EditorContext} from '../../../../shared/lib';

function createMapNodes(nodeMetadata, tag, type, name) {
    if (tag === 'terrain') {
        return null;
    }

    if (tag === 'composition') {
        let nodeInstanceXmls = nodeMetadata.querySelectorAll(':scope > *');

        return Array.from(nodeInstanceXmls).map(instanceXml => {
            return EditorContext.createMapNodeFromElement(instanceXml);
        });
    }

    return [
        EditorContext.createMapNode(0, 0, tag, type, name, true),
    ];
}

export default function usePrototypeMapNodes(nodeMetadata, tag, type, name) {
    let [mapNodes] = useState(createMapNodes(nodeMetadata, tag, type, name));

    return mapNodes;
}