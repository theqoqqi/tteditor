import SetPropertiesCommand from '../SetPropertiesCommand.js';

export default class SetTriggerEnabledCommand extends SetPropertiesCommand {

    constructor(editor, trigger, isEnabled) {
        super(editor, [trigger], {
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
}