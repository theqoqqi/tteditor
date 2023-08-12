import styles from './Mesh.module.css';
import React from 'react';
import {styling, useRenderContext, xmlUtils} from '../../../../shared/editor';
import PropTypes from 'prop-types';

Mesh.propTypes = {
    tag: PropTypes.string,
    type: PropTypes.string,
    nodeXml: PropTypes.instanceOf(Document),
};

function Mesh({ tag, type, nodeXml }) {
    let renderContext = useRenderContext();
    let meshXml = nodeXml.querySelector(':scope > mesh');
    let meshWidth = xmlUtils.getNumericContent(meshXml, 'width');
    let meshHeight = xmlUtils.getNumericContent(meshXml, 'height');

    if (!meshWidth || !meshHeight) {
        console.warn('trying to render mesh without size:', meshXml);
        return null;
    }

    if (!nodeXml.querySelector(':scope > texture')) {
        return null;
    }

    let texturePath = renderContext.getTexturePath(nodeXml);
    let style = styling.createNodeMeshStyles(renderContext, tag, type, nodeXml, meshXml);

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