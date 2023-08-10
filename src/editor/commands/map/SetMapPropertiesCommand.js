import SetPropertiesCommand from '../SetPropertiesCommand.js';

export default class SetMapPropertiesCommand extends SetPropertiesCommand {

    constructor(levelAccess, map, propertyValues) {
        super(levelAccess, [map], propertyValues);
    }

    setPropertyValue(map, propertyName, value) {
        this.levelAccess.setMapPropertyValue(propertyName, value);
    }

    getPropertyValue(map, propertyName) {
        return this.levelAccess.getMapPropertyValue(propertyName);
    }

    getTargetId(map) {
        return map.options.id;
    }

    get title() {
        return `Изменено ${Object.entries(this.propertyValues).length} свойств карты`;
    }

    get iconClass() {
        return 'bi-border-outer';
    }
}