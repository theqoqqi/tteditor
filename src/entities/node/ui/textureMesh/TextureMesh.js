import styles from './TextureMesh.module.css';
import React from 'react';
import {useRenderContext} from '../../../../entities/editor';
import PropTypes from 'prop-types';
import {getMeshXml} from '../../lib/xmlUtils.js';
import {createMeshStyles} from '../../lib/cssUtils.js';

TextureMesh.propTypes = {
    tag: PropTypes.string,
    type: PropTypes.string,
    nodeXml: PropTypes.oneOfType([
        PropTypes.instanceOf(Document),
        PropTypes.instanceOf(Element),
    ]),
    zIndex: PropTypes.number,
};

function TextureMesh({ tag, type, nodeXml, zIndex }) {
    let renderContext = useRenderContext();
    let meshXml = getMeshXml(nodeXml);

    let texturePath = renderContext.getTexturePath(nodeXml);
    let style = createMeshStyles(renderContext, tag, type, nodeXml, meshXml);

    return (
        <img
            className={styles.mesh}
            src={texturePath ?? '/img/empty.png'}
            style={{...style, ...{zIndex}}}
            alt=''
        />
    );
}

export default TextureMesh;