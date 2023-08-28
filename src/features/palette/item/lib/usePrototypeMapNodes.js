import {useEditorContext} from '../../../../entities/editor';
import {useState} from 'react';

function createMapNodes(editorContext, nodeMetadata, name) {
    let tag = nodeMetadata.tagName;
    let type = nodeMetadata.getAttribute('name');

    if (tag === 'terrain') {
        return null;
    }

    if (tag === 'composition') {
        let nodeInstanceXmls = nodeMetadata.querySelectorAll(':scope > *');

        return Array.from(nodeInstanceXmls).map(instanceXml => {
            return editorContext.createMapNodeFromElement(instanceXml);
        });
    }

    return [
        editorContext.createMapNode(0, 0, tag, type, name, true),
    ];
}

export default function usePrototypeMapNodes(nodeMetadata, name) {
    let editorContext = useEditorContext();
    let [mapNodes] = useState(createMapNodes(editorContext, nodeMetadata, name));

    return mapNodes;
}