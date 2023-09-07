import styles from './Control.module.css';
import React, {useCallback} from 'react';
import PropTypes from 'prop-types';
import Property from '../property/Property';
import FormCheckInput from 'react-bootstrap/FormCheckInput';
import getUniqueProperty from '../../lib/getUniqueProperty';

function isNull(objects, property) {
    return getUniqueProperty(objects, property.name) === null;
}

Control.propTypes = {
    title: PropTypes.string,
    objects: PropTypes.arrayOf(PropTypes.object),
    property: PropTypes.shape(Property.propTypes),
    properties: PropTypes.arrayOf(PropTypes.shape(Property.propTypes)),
    nullable: PropTypes.bool,
    onChange: PropTypes.func,
};

function Control({ title, objects, property, properties, nullable, onChange }) {
    properties ??= [property];

    let onToggleCallback = useCallback(e => {
        if (e.target.checked) {
            for (const p of properties) {
                onChange(p, p.defaultValue ?? '', null, e);
            }
        } else {
            for (const p of properties) {
                let value = getUniqueProperty(objects, p.name);

                onChange(p, null, value, e);
            }
        }
    }, [objects, onChange, properties]);

    return (
        <div className={styles.control}>
            <label className={styles.title}>
                {title}
            </label>
            <div className={styles.propertyList}>
                {properties.map(property => (
                    <Property
                        key={property.name}
                        objects={objects}
                        onChange={(...args) => onChange(property, ...args)}
                        {...property}
                        readonly={property.readonly || (nullable && isNull(objects, property))}
                    />
                ))}
                {nullable && (
                    <FormCheckInput
                        className={styles.nullCheckbox}
                        checked={!isNull(objects, properties[0])}
                        onChange={onToggleCallback}
                    />
                )}
            </div>
        </div>
    );
}

export default Control;