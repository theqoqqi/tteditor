import SetPropertiesCommand from '../SetPropertiesCommand.js';

export default class SetMapNodesPropertyCommand extends SetPropertiesCommand {

    constructor(levelAccess, mapNodes, propertyName, newValue) {
        super(levelAccess, mapNodes, {
            [propertyName]: newValue,
        });
    }

    setPropertyValue(mapNode, propertyName, value) {
        this.levelAccess.setMapNodePropertyValue(mapNode, propertyName, value);
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