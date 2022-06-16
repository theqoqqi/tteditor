import SetPropertiesCommand from '../SetPropertiesCommand.js';

export default class SetMapNodesPropertyCommand extends SetPropertiesCommand {

    constructor(editor, mapNodes, propertyName, newValue) {
        super(editor, mapNodes, {
            [propertyName]: newValue,
        });
    }

    setPropertyValue(mapNode, propertyName, value) {
        this.editor.setMapNodePropertyValue(mapNode, propertyName, value);
    }

    getTargetId(mapNode) {
        return mapNode.editorId;
    }
}