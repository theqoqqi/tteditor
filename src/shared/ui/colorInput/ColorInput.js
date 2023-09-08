import styles from './ColorInput.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import {FormControl} from 'react-bootstrap';
import {colorsUtils} from '../../lib';
import classNames from 'classnames';

ColorInput.propTypes = {
    className: PropTypes.any,
    value: PropTypes.string,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    readonly: PropTypes.bool,
};

function ColorInput({ className, value, onChange, placeholder, readonly }) {
    let color = colorsUtils.hexColorToColor(value);
    let brightness = colorsUtils.getColorBrightness(color);

    return (
        <FormControl
            type='text'
            className={classNames(styles.colorInput, className)}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            readOnly={readonly}
            style={{
                backgroundColor: value ?? 'white',
                color: brightness && brightness < 128 ? 'white' : 'black',
            }}
        />
    );
}

export default ColorInput;