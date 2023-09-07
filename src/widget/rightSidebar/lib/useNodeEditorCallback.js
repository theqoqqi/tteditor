import {
    getAllowedProperties,
    MoveNodesCommand,
    SetMapNodesPropertyCommand,
    useEditor,
    useEditorContext
} from '../../../shared/lib';
import {useCallback} from 'react';
import {differentValues} from '../../../entities/objectEditor';

function isPropertyAllowed(propertyName, tag) {
    return getAllowedProperties(tag).includes(propertyName);
}

function isRelativeNumericChange(property, event) {
    return property.type === 'number'
        && !event.nativeEvent.inputType;
}

function getRelativeNumericChange(oldValue, newValue) {
    let old = oldValue === differentValues ? 0 : oldValue;

    return newValue - old;
}

export default function useNodeEditorCallback(mapNodes) {
    let editor = useEditor();
    let editorContext = useEditorContext();

    return useCallback((changes) => {
        for (const { property, newValue, oldValue, event } of changes) {
            if (isRelativeNumericChange(property, event)) {
                let direction = getRelativeNumericChange(oldValue, newValue);
                let moveSteps = editorContext.getMoveStepsForNodes(mapNodes);
                let stepSize = moveSteps[property.name] * direction;
                let moveByX = property.name === 'x' ? stepSize : 0;
                let moveByY = property.name === 'y' ? stepSize : 0;

                editor.executeCommand(new MoveNodesCommand(mapNodes, moveByX, moveByY));
                return;
            }

            let filteredMapNodes = mapNodes.filter(mapNode => isPropertyAllowed(property.name, mapNode.tag));

            editor.executeCommand(new SetMapNodesPropertyCommand(filteredMapNodes, property.name, newValue));
        }
    }, [editor, editorContext, mapNodes]);
}
