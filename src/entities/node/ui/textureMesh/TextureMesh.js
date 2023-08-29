import styles from './TextureMesh.module.css';
import React from 'react';
import {useRenderContext} from '../../../../entities/editor';
import PropTypes from 'prop-types';
import {getMeshXml} from '../../lib/xmlUtils.js';
import {createMeshStyles} from '../../lib/cssUtils.js';
import {useAsync} from 'react-use';
import {RenderContext} from '../../../../shared/lib/index.js';

TextureMesh.propTypes = {
    tag: PropTypes.string,
    type: PropTypes.string,
    nodeXml: PropTypes.oneOfType([
        PropTypes.instanceOf(Document),
        PropTypes.instanceOf(Element),
    ]),
    zIndex: PropTypes.number,
    style: PropTypes.object,
};

function TextureMesh({ tag, type, nodeXml, zIndex, style }) {
    let renderContext = useRenderContext();
    let meshXml = getMeshXml(nodeXml);
    let asyncMeshStyle = useAsync(
        async () => await createMeshStyles(renderContext, tag, type, nodeXml, meshXml),
        [renderContext, tag, type, nodeXml, meshXml]
    );

    let texturePath = RenderContext.getTexturePath(nodeXml);

    return (
        <img
            className={styles.mesh}
            src={texturePath ?? '/img/empty.png'}
            style={{...asyncMeshStyle.value, ...{zIndex}, ...style}}
            alt=''
        />
    );
}

export default TextureMesh;