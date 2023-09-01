import {createBackgroundStyle, createTintStyle} from '../../../shared/lib/cssUtils';

export function createTerrainStyles(terrain) {
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

    return {
        backgroundImage: `url('data${terrain.texture}')`,
        ...tintStyles,
    };
}
