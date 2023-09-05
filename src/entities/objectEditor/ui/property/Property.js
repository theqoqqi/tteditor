import styles from './Property.module.css';
import React, {useCallback} from 'react';
import PropTypes from 'prop-types';
import {FormControl, FormSelect} from 'react-bootstrap';
import classNames from 'classnames';
import getUniqueProperty, {differentValues} from '../../lib/getUniqueProperty';

Property.propTypes = {
    name: PropTypes.string,
    type: PropTypes.string,
    objects: PropTypes.arrayOf(PropTypes.object),
    options: PropTypes.object,
    readonly: PropTypes.bool,
    onChange: PropTypes.func,
};

function Property({ name, type, objects, options, readonly, onChange }) {

    let propertyValue = getUniqueProperty(objects, name, '');
    let hasDifferences = propertyValue === differentValues;

    let onInputChange = useCallback(e => {
        let oldValue = propertyValue;
        let newValue = type === 'number'
            ? +e.target.value
            : e.target.value;

        onChange(newValue, oldValue, e);
    }, [onChange, type, propertyValue]);

    let differentValuesPlaceholder = '<разные>';

    let classes = classNames(styles.property, {
        [styles.readonly]: readonly,
    });

    if (type === 'select') {
        return (
            <FormSelect
                className={classNames(classes, styles.select)}
                value={hasDifferences ? differentValues.toString() : propertyValue}
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

    let value = hasDifferences ? '' : propertyValue;
    let placeholder = hasDifferences ? differentValuesPlaceholder : null;

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