import React, {useCallback} from 'react';
import PropTypes from 'prop-types';
import getUniqueProperty, {differentValues} from '../../lib/getUniqueProperty';
import useDebouncedOnChange from '../../lib/useDebouncedOnChange';
import {colorsUtils} from '../../../../shared/lib';
import PropertyInput from '../propertyInput/PropertyInput';

Property.propTypes = {
    name: PropTypes.string,
    type: PropTypes.string,
    objects: PropTypes.arrayOf(PropTypes.object),
    options: PropTypes.object,
    readonly: PropTypes.bool,
    debounce: PropTypes.number,
    onChange: PropTypes.func,
};

function Property({ name, type, objects, options, readonly, debounce = 0, onChange }) {

    let propertyValue = getUniqueProperty(objects, name, '');

    let onChangeWithCast = useCallback((newValue, oldValue, event) => {
        let castedNewValue = newValue;

        if (type === 'number') {
            castedNewValue = +newValue;
        }

        if (type === 'color') {
            castedNewValue = colorsUtils.hexColorToColor(newValue) ?? oldValue;
        }

        onChange(castedNewValue, oldValue, event);
    }, [type, onChange]);

    let shouldDebounce = useCallback(e => {
        return e.nativeEvent instanceof InputEvent;
    }, []);

    let [inputValue, onInputChange] = useDebouncedOnChange({
        storedValue: propertyValue,
        millis: debounce,
        shouldDebounce: shouldDebounce,
        onChange: onChangeWithCast,
    });

    let hasDifferences = inputValue === differentValues;
    let differentValuesPlaceholder = '<разные>';

    let inputProps = {
        type: type,
        readonly: readonly,
        onChange: onInputChange,
    };

    if (type === 'select') {
        return (
            <PropertyInput
                {...inputProps}
                value={hasDifferences ? differentValues.toString() : inputValue}
            >
                {hasDifferences && (
                    <option disabled value={differentValues.toString()}>
                        {differentValuesPlaceholder}
                    </option>
                )}
                {Object.entries(options).map(([value, title]) => (
                    <option key={value} value={value}>
                        {title}
                    </option>
                ))}
            </PropertyInput>
        );
    }

    let value = hasDifferences ? '' : inputValue;
    let placeholder = hasDifferences ? differentValuesPlaceholder : null;

    if (type === 'color') {
        return (
            <PropertyInput
                {...inputProps}
                value={colorsUtils.colorToHexColor(value) ?? ''}
                placeholder={placeholder}
            />
        );
    }

    return (
        <PropertyInput
            {...inputProps}
            value={value}
            placeholder={placeholder}
        />
    );
}

export default Property;