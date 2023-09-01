import {colorsUtils, RenderContext} from '../../../shared/lib';
import {createBackgroundStyle, createColorStyles, createTransform} from '../../../shared/lib/cssUtils';

export function createObjectNodeStyles(x, y) {
    return {
        left: x,
        top: y,
    };
}

export function createMarkerNodeStyles(x, y, radiusX, radiusY) {
    return {
        left: x + radiusX,
        top: y + radiusY,
    };
}

export async function createMeshStyles(renderContext, tag, type, nodeXml, meshXml) {
    let frameBounds = await renderContext.getDefaultFrameBoundsFor(tag, type, nodeXml);
    let x = frameBounds.x;
    let y = frameBounds.y;
    let width = frameBounds.width;
    let height = frameBounds.height;
    let hasTexture = RenderContext.getTexturePath(nodeXml) !== null;

    let transform = createTransform(width, height, renderContext, meshXml);
    let colorStyles = createColorStyles(nodeXml, hasTexture);

    return {
        clip: `rect(${y}px, ${x + width}px, ${y + height}px, ${x}px)`,
        left: `${-x}px`,
        top: `${-y}px`,
        transformOrigin: `${x}px ${y}px`,
        transform,
        ...colorStyles,
    };
}

export function createMarkerMeshStyles(width, height, hexIntColor) {
    let backgroundStyle = {};

    if (hexIntColor) {
        let rgba = colorsUtils.hexIntColorToColor(hexIntColor);

        backgroundStyle = createBackgroundStyle(rgba);
    }

    return {
        left: -width / 2,
        top: -height / 2,
        width: width,
        height: height,
        ...backgroundStyle,
    };
}

export function createSelectionBoxStyles(x, y, width, height, zIndex) {
    return {
        left: x,
        top: y,
        width: width,
        height: height,
        zIndex: zIndex,
    };
}
