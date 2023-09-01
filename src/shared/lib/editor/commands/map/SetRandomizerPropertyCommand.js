import SetPropertiesCommand from '../SetPropertiesCommand';

export default class SetRandomizerPropertyCommand extends SetPropertiesCommand {

    constructor(randomizer, propertyName, newValue) {
        super([randomizer], {
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
}