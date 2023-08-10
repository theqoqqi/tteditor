import SetPropertiesCommand from '../SetPropertiesCommand.js';

export default class SetMapNodesPropertyCommand extends SetPropertiesCommand {

    constructor(mapNodes, propertyName, newValue) {
        super(mapNodes, {
            [propertyName]: newValue,
        });
    }

    setPropertyValue(mapNode, propertyName, value) {
        this.editor.setMapNodePropertyValue(mapNode, propertyName, value);
    }

    getTargetId(mapNode) {
        return mapNode.editorId;
    }

    get title() {
        return `Изменено ${this.targets.length} объектов`;
    }

    get iconClass() {
        return 'bi-gear-fill';
    }
}