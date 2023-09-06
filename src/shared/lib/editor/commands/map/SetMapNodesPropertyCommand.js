import SetPropertiesCommand from '../SetPropertiesCommand';

export default class SetMapNodesPropertyCommand extends SetPropertiesCommand {

    constructor(mapNodes, propertyName, newValue) {
        super(mapNodes, {
            [propertyName]: newValue,
        });
    }

    setPropertyValue(mapNode, propertyName, value) {
        if (propertyName === 'x') {
            this.editor.context.setMapNodePosition(mapNode, value, mapNode.y);
            return;
        }

        if (propertyName === 'y') {
            this.editor.context.setMapNodePosition(mapNode, mapNode.x, value);
            return;
        }

        mapNode[propertyName] = value;
    }

    getTargetId(mapNode) {
        return mapNode.editorId;
    }

    get title() {
        return `Изменено ${this.targets.length} объектов`;
    }
}