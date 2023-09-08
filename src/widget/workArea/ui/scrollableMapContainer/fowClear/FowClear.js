import styles from './FowClear.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import {colorsUtils} from '../../../../../shared/lib';

FowClear.propTypes = {
    color: PropTypes.shape({
        r: PropTypes.number,
        g: PropTypes.number,
        b: PropTypes.number,
        a: PropTypes.number,
    }),
};

function FowClear({ color }) {

    if (!color) {
        return null;
    }

    let colorStyles = {
        backgroundColor: colorsUtils.colorToCssRgba(color),
    };

    return (
        <div className={styles.fowClear} style={colorStyles} />
    );
}

export default FowClear;