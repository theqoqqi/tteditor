import {geometryUtils, matrixUtils, xmlUtils, colorsUtils} from '../../editor';

function createTransform(width, height, renderContext, meshXml) {
    let initialVertices = geometryUtils.createBoxVertices(0, 0, width, height);
    let targetVertices = renderContext.getMeshTargetVertices(meshXml);

    let matrix = matrixUtils.getTransformMatrix(initialVertices, targetVertices);

    return `matrix3d(${matrixUtils.transpose(matrix).flatMap(row => row).join(',')})`;
}

function createColorStyles(nodeXml, hasTexture) {
    let intColor = xmlUtils.getTextContent(nodeXml, 'mesh > color');

    if (!intColor) {
        return null;
    }

    let color = colorsUtils.hexIntColorToColor(intColor);

    return hasTexture
        ? createTintStyle(color)
        : createBackgroundStyle(color);
}

function createTintStyle(rgba) {
    let hsba = colorsUtils.rgbaColorToHsbaColor(rgba);
    let cssFilters = colorsUtils.hsbaColorToCssFilters(hsba);

    return {
        filter: cssFilters,
    };
}

function createBackgroundStyle(rgba) {
    return {
        backgroundColor: colorsUtils.colorToCssRgba(rgba),
    };
}

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
    let hasTexture = renderContext.getTexturePath(nodeXml) !== null;

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
