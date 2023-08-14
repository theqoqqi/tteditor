import MultiTargetCommand from './MultiTargetCommand.js';

export default class SetPropertiesCommand extends MultiTargetCommand {

    constructor(targets, propertyValues) {
        super(targets);

        this.propertyValues = propertyValues;
    }

    setup(editor) {
        super.setup(editor);

        this.oldPropertyValuesByTargetIds = this.getCurrentPropertyValues(this.targets);
    }

    executeFor(target) {
        this.setPropertyValues(target, this.propertyValues);
    }

    undoFor(target) {
        let targetId = this.getTargetId(target);
        let oldPropertyValues = this.oldPropertyValuesByTargetIds[targetId];

        this.setPropertyValues(target, oldPropertyValues);
    }

    getCurrentPropertyValues(targets) {
        let propertyValuesByTargetIds = {};

        for (const target of targets) {
            let targetId = this.getTargetId(target);

            propertyValuesByTargetIds[targetId] = this.getCurrentPropertyValuesFromTarget(target);
        }

        return propertyValuesByTargetIds;
    }

    getCurrentPropertyValuesFromTarget(target) {
        let propertyValues = {};

        for (const propertyName of Object.keys(this.propertyValues)) {
            propertyValues[propertyName] = this.getPropertyValue(target, propertyName);
        }

        return propertyValues;
    }

    setPropertyValues(target, propertyValues) {
        for (const [propertyName, newValue] of Object.entries(propertyValues)) {
            this.setPropertyValue(target, propertyName, newValue);
        }
    }

    setPropertyValue(target, propertyName, value) {
        // Abstract
    }

    getPropertyValue(target, propertyName) {
        return target[propertyName];
    }

    getTargetId(target) {
        // Abstract
    }

    canBeMerged(other) {
        return this.isSameTypes(other) && this.isSameTargets(other) && this.isSameProperties(other);
    }

    isSameProperties(other) {
        let properties = Object.keys(this.propertyValues).sort();
        let otherProperties = Object.keys(other.propertyValues).sort();

        return properties.length === otherProperties.length
            && properties.every((target, index) => target === otherProperties[index]);
    }

    merge(other) {
        this.propertyValues = other.propertyValues;
    }
}