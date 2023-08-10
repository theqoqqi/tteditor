import SetPropertiesCommand from '../SetPropertiesCommand.js';

export default class SetTriggerPropertyCommand extends SetPropertiesCommand {

    constructor(trigger, propertyName, newValue) {
        super([trigger], {
            [propertyName]: newValue,
        });
    }

    setPropertyValue(trigger, propertyName, value) {
        trigger[propertyName] = value;
    }

    getTargetId(trigger) {
        return trigger.editorId;
    }

    get title() {
        return `Изменено ${this.targets.length} триггеров`;
    }

    get iconClass() {
        return 'bi-file-earmark-medical-fill';
    }
}