import styles from './PaletteItemPreview.module.css';
import React, {useState} from 'react';
import PropTypes from 'prop-types';
import useFirstIntersection from '../../lib/useFirstIntersection.js';
import {MapNode} from '../../../../../entities/editor';
import TerrainPreview from './terrainPreview/TerrainPreview.js';
import NodesPreview from './nodesPreview/NodesPreview.js';

PaletteItemPreview.propTypes = {
    nodeMetadata: PropTypes.instanceOf(Element),
    mapNodes: PropTypes.arrayOf(PropTypes.instanceOf(MapNode)),
};

function createContent(nodeMetadata, mapNodes) {
    let tag = nodeMetadata.tagName;
    let type = nodeMetadata.getAttribute('name');

    if (tag === 'terrain') {
        return <TerrainPreview tag={tag} type={type} />;
    }

    return <NodesPreview nodeMetadata={nodeMetadata} mapNodes={mapNodes} />;
}

function PaletteItemPreview({ nodeMetadata, mapNodes }) {
    let [content, setContent] = useState(null);
    let ref = useFirstIntersection(() => {
        setContent(createContent(nodeMetadata, mapNodes));
    }, [nodeMetadata, mapNodes]);

    return (
        <div ref={ref} className={styles.paletteItemPreview}>
            {content}
        </div>
    );
}

export default PaletteItemPreview;