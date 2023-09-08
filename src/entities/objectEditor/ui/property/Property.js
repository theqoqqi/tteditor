import styles from './Property.module.css';
import React, {useCallback} from 'react';
import PropTypes from 'prop-types';
import {FormControl, FormSelect} from 'react-bootstrap';
import classNames from 'classnames';
import getUniqueProperty, {differentValues} from '../../lib/getUniqueProperty';
import useDebouncedOnChange from '../../lib/useDebouncedOnChange';
import {ColorInput} from '../../../../shared/ui';
import {colorsUtils} from '../../../../shared/lib';

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
    let hasDifferences = propertyValue === differentValues;

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

    let differentValuesPlaceholder = '<разные>';

    let classes = classNames(styles.property, {
        [styles.readonly]: readonly,
    });

    if (type === 'select') {
        return (
            <FormSelect
                className={classNames(classes, styles.select)}
                value={hasDifferences ? differentValues.toString() : inputValue}
                onChange={onInputChange}
                disabled={readonly}
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
            </FormSelect>
        );
    }

    let value = hasDifferences ? '' : inputValue;
    let placeholder = hasDifferences ? differentValuesPlaceholder : null;

    if (type === 'color') {
        return (
            <ColorInput
                className={classNames(classes, styles.input, styles.color)}
                value={colorsUtils.colorToHexColor(value) ?? ''}
                onChange={onInputChange}
                placeholder={placeholder}
                readonly={readonly}
            />
        );
    }

    return (
        <FormControl
            className={classNames(classes, styles.input)}
            type={type}
            value={value}
            placeholder={placeholder}
            onChange={onInputChange}
            readOnly={readonly}
        />
    );
}

export default Property;