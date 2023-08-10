import SetPropertiesCommand from '../SetPropertiesCommand.js';

export default class SetRandomizerPropertyCommand extends SetPropertiesCommand {

    constructor(levelAccess, randomizer, propertyName, newValue) {
        super(levelAccess, [randomizer], {
            [propertyName]: newValue,
        });
    }

    setPropertyValue(randomizer, propertyName, value) {
        randomizer[propertyName] = value;
    }

    getTargetId(randomizer) {
        return randomizer.editorId;
    }

    get title() {
        return `Изменено ${this.targets.length} рандомайзеров`;
    }

    get iconClass() {
        return 'bi-patch-check-fill';
    }
}