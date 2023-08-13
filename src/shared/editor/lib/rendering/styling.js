import {createBoxVertices} from '../../core/util/geometry.js';
import {getTransformMatrix, transpose} from '../../core/util/matrix.js';
import {getTextContent} from '../../core/util/xml.js';
import {
    colorToCssRgba,
    hexIntColorToColor,
    hsbaColorToCssFilters,
    rgbaColorToHsbaColor
} from '../../core/util/colors.js';

function createTransform(width, height, renderContext, meshXml) {
    let initialVertices = createBoxVertices(0, 0, width, height);
    let targetVertices = renderContext.getMeshTargetVertices(meshXml);

    let matrix = getTransformMatrix(initialVertices, targetVertices);

    return `matrix3d(${transpose(matrix).flatMap(row => row).join(',')})`;
}

function createColorStyles(nodeXml, hasTexture) {
    let intColor = getTextContent(nodeXml, 'mesh > color');

    if (!intColor) {
        return null;
    }

    let color = hexIntColorToColor(intColor);

    return hasTexture
        ? createTintStyle(color)
        : createBackgroundStyle(color);
}

function createTintStyle(rgba) {
    let hsba = rgbaColorToHsbaColor(rgba);
    let cssFilters = hsbaColorToCssFilters(hsba);

    return {
        filter: cssFilters,
    };
}

function createBackgroundStyle(rgba) {
    return {
        backgroundColor: colorToCssRgba(rgba),
    };
}

export function createNodeStyles(x, y) {
    return {
        left: x,
        top: y,
    };
}

export function createMeshStyles(renderContext, tag, type, nodeXml, meshXml) {
    let frameBounds = renderContext.getDefaultFrameBoundsFor(tag, type, nodeXml);
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

export function createMarkerMeshStyles(width, height) {
    return {
        left: -width / 2,
        top: -height / 2,
        width: width,
        height: height,
    };
}
