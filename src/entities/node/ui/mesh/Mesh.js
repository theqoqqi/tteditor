import styles from './Mesh.module.css';
import React from 'react';
import {createNodeMeshStyles, useRenderContext} from '../../../../shared/editor';
import PropTypes from 'prop-types';
import {getNumericContent} from '../../../../shared/editor/core/util/xml.js';

Mesh.propTypes = {
    tag: PropTypes.string,
    type: PropTypes.string,
    nodeXml: PropTypes.instanceOf(Document),
};

function Mesh({ tag, type, nodeXml }) {
    let renderContext = useRenderContext();
    let meshXml = nodeXml.querySelector(':scope > mesh');
    let meshWidth = getNumericContent(meshXml, 'width');
    let meshHeight = getNumericContent(meshXml, 'height');

    if (!meshWidth || !meshHeight) {
        console.warn('trying to render mesh without size:', meshXml);
        return null;
    }

    if (!nodeXml.querySelector(':scope > texture')) {
        return null;
    }

    let texturePath = renderContext.getTexturePath(nodeXml);
    let style = createNodeMeshStyles(renderContext, tag, type, nodeXml, meshXml);

    return (
        <img
            className={styles.mesh}
            src={texturePath ?? '/img/empty.png'}
            style={style}
            alt=''
        />
    );
}

export default Mesh;