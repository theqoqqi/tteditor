import {getTransformMatrix, transpose} from './editor/util/matrix.js';
import {getTextContent} from './editor/util/xml.js';
import {colorToCssRgba, hexIntColorToColor, hsbaColorToCssFilters, rgbaColorToHsbaColor} from './editor/util/colors.js';
import {createBoxVertices} from './editor/util/geometry.js';
import RenderContext from './editor/RenderContext.js';

export function createTransform(width, height, renderContext, meshXml) {
    let initialVertices = createBoxVertices(0, 0, width, height);
    let targetVertices = RenderContext.getMeshTargetVertices(meshXml);

    if (!targetVertices) {
        return null;
    }

    let matrix = getTransformMatrix(initialVertices, targetVertices);

    return `matrix3d(${transpose(matrix).flatMap(row => row).join(',')})`;
}

export function createColorStyles(nodeXml, hasTexture) {
    let intColor = getTextContent(nodeXml, 'mesh > color');

    if (!intColor) {
        return null;
    }

    let color = hexIntColorToColor(intColor);

    return hasTexture
        ? createTintStyle(color)
        : createBackgroundStyle(color);
}

export function createTintStyle(rgba) {
    let hsba = rgbaColorToHsbaColor(rgba);
    let cssFilters = hsbaColorToCssFilters(hsba);

    return {
        filter: cssFilters,
    };
}

export function createBackgroundStyle(rgba) {
    return {
        backgroundColor: colorToCssRgba(rgba),
    };
}
