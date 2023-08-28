import React, {useLayoutEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {ObjectMesh} from '../../../../../../entities/node';
import {useNodeXml, xmlUtils} from '../../../../../../entities/editor';

let ICON_SIZE = 64;

TerrainPreview.propTypes = {
    tag: PropTypes.string,
    type: PropTypes.string,
};

function TerrainPreview({ tag, type }) {
    let nodeXml = useNodeXml(tag, type);
    let [scalingStyles, setScalingStyles] = useState(null);

    useLayoutEffect(() => {
        if (!nodeXml) {
            return;
        }

        let width = xmlUtils.getNumericContent(nodeXml, 'mesh > width');
        let height = xmlUtils.getNumericContent(nodeXml, 'mesh > height');

        let ratioX = ICON_SIZE / width;
        let ratioY = ICON_SIZE / height;
        let scale = Math.min(1, ratioX, ratioY);

        setScalingStyles({
            transformOrigin: '0 0',
            transform: `scale(${scale}, ${scale})`,
        });
    }, [nodeXml]);

    if (!nodeXml) {
        return null;
    }

    return (
        <ObjectMesh
            tag={tag}
            type={type}
            nodeXml={nodeXml}
            zIndex={0}
            style={scalingStyles}
        />
    );
}

export default TerrainPreview;