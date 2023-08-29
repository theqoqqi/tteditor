import {useState} from 'react';
import {EditorContext} from '../../../../shared/lib';

function createMapNodes(nodeMetadata, name) {
    let tag = nodeMetadata.tagName;
    let type = nodeMetadata.getAttribute('name');

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

export default function usePrototypeMapNodes(nodeMetadata, name) {
    let [mapNodes] = useState(createMapNodes(nodeMetadata, name));

    return mapNodes;
}