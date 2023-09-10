import styles from './PaletteItemPreview.module.css';
import React, {useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {useFirstIntersection} from '../../../../../shared/lib';
import {MapNode} from '../../../../../shared/lib';
import TerrainPreview from './terrainPreview/TerrainPreview';
import NodesPreview from './nodesPreview/NodesPreview';
import {useIntersection} from 'react-use';
import classNames from 'classnames';

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
    let ref = useRef(null);
    let intersection = useIntersection(ref, {});

    useFirstIntersection(ref, () => {
        setContent(createContent(tag, type, mapNodes));
    }, [tag, type, mapNodes]);

    let isVisible = intersection && intersection.isIntersecting;

    return (
        <div
            ref={ref}
            className={classNames(styles.paletteItemPreview, {
                [styles.hidden]: !isVisible,
            })}
        >
            {content}
        </div>
    );
}

export default PaletteItemPreview;