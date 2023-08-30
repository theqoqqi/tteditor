import styles from './PaletteItem.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import PaletteItemPreview from './paletteItemPreview/PaletteItemPreview.js';
import PaletteItemTitle from './paletteItemTitle/PaletteItemTitle.js';
import usePrototypeMapNodes from '../lib/usePrototypeMapNodes.js';
import classNames from 'classnames';
import useIsPaletteItemSelected from '../lib/useIsPaletteItemSelected.js';
import useOnSelectPaletteItem from '../lib/useOnSelectPaletteItem.js';

PaletteItem.propTypes = {
    nodeMetadata: PropTypes.instanceOf(Element),
    tag: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string,
};

function PaletteItem({ nodeMetadata, tag, type, name }) {
    let mapNodes = usePrototypeMapNodes(nodeMetadata, tag, type, name);
    let isSelected = useIsPaletteItemSelected(tag, type);
    let onClick = useOnSelectPaletteItem(tag, type);

    let title = name ?? type ?? tag;

    return (
        <div
            className={classNames(styles.paletteItem, {
                [styles.selected]: isSelected,
            })}
            onClick={onClick}
        >
            <PaletteItemPreview tag={tag} type={type} mapNodes={mapNodes} />
            <PaletteItemTitle className={styles.title} title={title} />
        </div>
    );
}

export default PaletteItem;