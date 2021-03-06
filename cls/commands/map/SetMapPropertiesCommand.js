import SetPropertiesCommand from '../SetPropertiesCommand.js';

export default class SetMapPropertiesCommand extends SetPropertiesCommand {

    constructor(editor, map, propertyValues) {
        super(editor, [map], propertyValues);
    }

    setPropertyValue(map, propertyName, value) {
        this.editor.setMapPropertyValue(propertyName, value);
    }

    getPropertyValue(map, propertyName) {
        return this.editor.getMapPropertyValue(propertyName);
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