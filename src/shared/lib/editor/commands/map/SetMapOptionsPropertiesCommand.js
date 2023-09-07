import SetPropertiesCommand from '../SetPropertiesCommand';

export default class SetMapOptionsPropertiesCommand extends SetPropertiesCommand {

    constructor(mapOptions, propertyValues) {
        super([mapOptions], propertyValues);
    }

    setPropertyValue(mapOptions, propertyName, value) {
        mapOptions[propertyName] = value;
    }

    getPropertyValue(mapOptions, propertyName) {
        return mapOptions[propertyName];
    }

    getTargetId(mapOptions) {
        return mapOptions.id;
    }

    get title() {
        return `Изменено ${Object.entries(this.propertyValues).length} свойств уровня`;
    }
}