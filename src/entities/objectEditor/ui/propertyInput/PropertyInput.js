import styles from './PropertyInput.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {FormControl, FormSelect} from 'react-bootstrap';
import {ColorInput} from '../../../../shared/ui';

PropertyInput.propTypes = {
    className: PropTypes.any,
    type: PropTypes.string,
    value: PropTypes.any,
    placeholder: PropTypes.string,
    readonly: PropTypes.bool,
    onChange: PropTypes.func,
    children: PropTypes.any,
};

function PropertyInput({ className, type, value, placeholder, readonly, onChange, children }) {
    let classes = classNames(styles.propertyInput, className, {
        [styles.readonly]: readonly,
    });

    if (type === 'select') {
        return (
            <FormSelect
                className={classNames(classes, styles.select)}
                value={value}
                onChange={onChange}
                disabled={readonly}
            >
                {children}
            </FormSelect>
        );
    }

    if (type === 'color') {
        return (
            <ColorInput
                className={classNames(classes, styles.input, styles.color)}
                value={value}
                onChange={onChange}
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
            onChange={onChange}
            readOnly={readonly}
        />
    );
}

export default PropertyInput;