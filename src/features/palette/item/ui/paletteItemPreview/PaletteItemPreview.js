import styles from './PaletteItemPreview.module.css';
import React, {useState} from 'react';
import PropTypes from 'prop-types';
import useFirstIntersection from '../../lib/useFirstIntersection.js';
import {MapNode} from '../../../../../shared/lib';
import TerrainPreview from './terrainPreview/TerrainPreview.js';
import NodesPreview from './nodesPreview/NodesPreview.js';

PaletteItemPreview.propTypes = {
    tag: PropTypes.string,
    type: PropTypes.string,
    mapNodes: PropTypes.arrayOf(PropTypes.instanceOf(MapNode)),
};

function createContent(tag, type, mapNodes) {
    if (tag === 'terrain') {
        return <TerrainPreview tag={tag} type={type} />;
    }

    return <NodesPreview tag={tag} type={type} mapNodes={mapNodes} />;
}

function PaletteItemPreview({ tag, type, mapNodes }) {
    let [content, setContent] = useState(null);
    let ref = useFirstIntersection(() => {
        setContent(createContent(tag, type, mapNodes));
    }, [tag, type, mapNodes]);

    return (
        <div ref={ref} className={styles.paletteItemPreview}>
            {content}
        </div>
    );
}

export default PaletteItemPreview;