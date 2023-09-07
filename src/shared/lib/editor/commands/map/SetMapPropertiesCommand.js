import SetPropertiesCommand from '../SetPropertiesCommand';

export default class SetMapPropertiesCommand extends SetPropertiesCommand {

    constructor(map, propertyValues) {
        super([map], propertyValues);
    }

    setPropertyValue(map, propertyName, value) {
        map[propertyName] = value;
    }

    getPropertyValue(map, propertyName) {
        return map[propertyName];
    }

    getTargetId(map) {
        return map.editorId;
    }

    get title() {
        return `Изменено ${Object.entries(this.propertyValues).length} свойств карты`;
    }
}