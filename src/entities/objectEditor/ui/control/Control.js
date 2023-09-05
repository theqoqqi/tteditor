import styles from './Control.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import Property from '../property/Property';

Control.propTypes = {
    title: PropTypes.string,
    objects: PropTypes.arrayOf(PropTypes.object),
    property: PropTypes.shape(Property.propTypes),
    properties: PropTypes.arrayOf(PropTypes.shape(Property.propTypes)),
    onChange: PropTypes.func,
};

function Control({ title, objects, property, properties, onChange }) {
    properties ??= [property];

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
                    />
                ))}
            </div>
        </div>
    );
}

export default Control;