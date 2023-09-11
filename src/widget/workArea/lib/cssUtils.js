import {createBackgroundStyle, createTintStyle} from '../../../shared/lib/cssUtils';

export function createTerrainStyles(editorContext, terrain) {
    let hasTexture = terrain.texture !== null;
    let hasColor = terrain.color !== null;

    if (!hasTexture) {
        return hasColor
            ? createBackgroundStyle(terrain.color)
            : null;
    }

    let tintStyles = hasColor
        ? createTintStyle(terrain.color)
        : null;

    let textureUrl = editorContext.getFileUrl(terrain.texture);

    return {
        backgroundImage: `url('${textureUrl}')`,
        ...tintStyles,
    };
}
