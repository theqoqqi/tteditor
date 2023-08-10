import SetPropertiesCommand from '../SetPropertiesCommand.js';

export default class SetTriggerEnabledCommand extends SetPropertiesCommand {

    constructor(trigger, isEnabled) {
        super([trigger], {
            isEnabled,
        });
    }

    setPropertyValue(trigger, propertyName, value) {
        if (value) {
            trigger.removeAllStatementsOfType('never');
        } else {
            trigger.addStatement('<never/>');
        }
    }

    getPropertyValue(target, propertyName) {
        return !target.hasStatementOfType('never');
    }

    getTargetId(trigger) {
        return trigger.editorId;
    }

    get title() {
        return `Переключено ${this.targets.length} триггеров`;
    }

    get iconClass() {
        return 'bi-file-earmark-check-fill';
    }
}