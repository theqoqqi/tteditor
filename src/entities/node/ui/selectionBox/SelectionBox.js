import styles from './SelectionBox.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {styling, useRenderContext} from '../../../../shared/editor';

SelectionBox.propTypes = {
    bounds: PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number,
        width: PropTypes.number,
        height: PropTypes.number,
    }),
    selected: PropTypes.bool,
};

function SelectionBox({ bounds, selected }) {
    let { x, y, width, height } = bounds;
    let renderContext = useRenderContext();

    let zIndex = renderContext.getSelectionBoxZIndex(width, height);
    let style = styling.createSelectionBoxStyles(x, y, width, height, zIndex);

    return (
        <div
            className={classNames(styles.selectionBox, {
                [styles.selected]: selected,
            })}
            style={style}
        />
    );
}

export default SelectionBox;