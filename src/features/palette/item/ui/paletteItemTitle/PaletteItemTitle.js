import styles from './PaletteItemTitle.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

PaletteItemTitle.propTypes = {
    className: PropTypes.any,
    title: PropTypes.string,
};

function PaletteItemTitle({ className, title }) {
    return (
        <div className={classNames(styles.paletteItemTitle, className)}>
            {title}
        </div>
    );
}

export default PaletteItemTitle;