
export default function getPropertyValuesFromChanges(changes) {
    let reducer = (values, { property, newValue }) => {
        values[property.name] = newValue;

        return values;
    };

    return changes.reduce(reducer, {});
}