import styles from './TextureMesh.module.css';
import React from 'react';
import {styling, useRenderContext} from '../../../../shared/editor';
import PropTypes from 'prop-types';
import {getMeshXml} from '../../lib/xmlUtils.js';

TextureMesh.propTypes = {
    tag: PropTypes.string,
    type: PropTypes.string,
    nodeXml: PropTypes.instanceOf(Document),
};

function TextureMesh({ tag, type, nodeXml }) {
    let renderContext = useRenderContext();
    let meshXml = getMeshXml(nodeXml);

    let texturePath = renderContext.getTexturePath(nodeXml);
    let style = styling.createMeshStyles(renderContext, tag, type, nodeXml, meshXml);

    return (
        <img
            className={styles.mesh}
            src={texturePath ?? '/img/empty.png'}
            style={style}
            alt=''
        />
    );
}

export default TextureMesh;