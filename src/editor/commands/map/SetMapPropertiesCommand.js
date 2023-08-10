import SetPropertiesCommand from '../SetPropertiesCommand.js';

export default class SetMapPropertiesCommand extends SetPropertiesCommand {

    constructor(map, propertyValues) {
        super([map], propertyValues);
    }

    setPropertyValue(map, propertyName, value) {
        this.levelEditor.setMapPropertyValue(propertyName, value);
    }

    getPropertyValue(map, propertyName) {
        return this.levelEditor.getMapPropertyValue(propertyName);
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