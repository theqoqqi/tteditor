import SetPropertiesCommand from '../SetPropertiesCommand.js';

export default class SetRandomizerPropertyCommand extends SetPropertiesCommand {

    constructor(editor, randomizer, propertyName, newValue) {
        super(editor, [randomizer], {
            [propertyName]: newValue,
        });
    }

    setPropertyValue(randomizer, propertyName, value) {
        randomizer[propertyName] = value;
    }

    getTargetId(randomizer) {
        return randomizer.editorId;
    }
}