import styles from './Control.module.css';
import React, {useCallback} from 'react';
import PropTypes from 'prop-types';
import Property from '../property/Property';
import FormCheckInput from 'react-bootstrap/FormCheckInput';
import getUniqueProperty from '../../lib/getUniqueProperty';
import {BsXCircleFill} from 'react-icons/bs';
import ControlContainer from '../controlContainer/ControlContainer';

function isNull(objects, property) {
    return getUniqueProperty(objects, property.name) === null;
}

Control.propTypes = {
    title: PropTypes.string,
    objects: PropTypes.arrayOf(PropTypes.object),
    property: PropTypes.shape(Property.propTypes),
    properties: PropTypes.arrayOf(PropTypes.shape(Property.propTypes)),
    nullable: PropTypes.bool,
    removable: PropTypes.bool,
    onChange: PropTypes.func,
    onRemove: PropTypes.func,
};

function Control({ title, objects, property, properties, nullable, removable, onChange, onRemove }) {
    properties ??= [property];

    let onToggleCallback = useCallback(e => {
        if (e.target.checked) {
            onChange(properties.map(p => ({
                property: p,
                newValue: p.defaultValue ?? '',
                oldValue: null,
                event: e,
            })));
        } else {
            onChange(properties.map(p => ({
                property: p,
                newValue: null,
                oldValue: getUniqueProperty(objects, p.name),
                event: e,
            })));
        }
    }, [objects, onChange, properties]);

    let onRemoveCallback = useCallback(() => {
        onRemove({ objects, properties });
    }, [onRemove, objects, properties]);

    return (
        <ControlContainer
            heading={(
                <label className={styles.title}>
                    {title}
                </label>
            )}
        >
            {properties.map(property => (
                <Property
                    key={property.name}
                    objects={objects}
                    onChange={(newValue, oldValue, event) => {
                        return onChange([
                            {
                                objects,
                                property,
                                newValue,
                                oldValue,
                                event
                            },
                        ]);
                    }}
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
            {removable && (
                <BsXCircleFill
                    className={styles.removeIcon}
                    onClick={onRemoveCallback}
                />
            )}
        </ControlContainer>
    );
}

export default Control;