import uniq from 'lodash.uniq';

export const differentValues = Symbol('getUniqueProperty.differentValues');

export default function getUniqueProperty(objects, propertyName, defaultValue = null) {
    let values = objects
        .map(object => object[propertyName])
        .filter(v => v !== null);
    let uniqueCount = uniq(values).length;

    if (uniqueCount <= 1) {
        return values[0] ?? defaultValue;
    }

    return differentValues;
}
