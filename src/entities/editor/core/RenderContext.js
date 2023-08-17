import {getNumericContent, getTextContent} from './util/xml.js';
import {createBoundsWithSize, createBoxVertices, flipVertices, swapVertices} from './util/geometry.js';

let COORDS_RATIO = 78 / 128;

// noinspection CssInvalidHtmlTagReference
export default class RenderContext {

    constructor(context) {
        this.context = context;
    }

    getIconRadius(tagName) {
        if (tagName === 'area') {
            return 0;
        }

        return tagName === 'waypoint' ? 8 : 12;
    }

    getAreaRadiusSizesFor(mapNode) {
        let declaredRadius = this.getDeclaredRadius(mapNode) ?? 0;
        let applyRatio = mapNode.type !== 'Reveal200';

        return this.getRadiusSizes(declaredRadius, applyRatio);
    }

    getRadiusSizes(radius, applyRatio) {
        const radiusX = radius;
        const radiusY = radius * (applyRatio ? COORDS_RATIO : 1);

        return { radiusX, radiusY };
    }

    getDeclaredRadius(mapNode) {
        if (mapNode.radius) {
            return mapNode.radius / 2;
        }

        let nodeMetadata = this.context.getNodeMetadataByName(mapNode.tag, mapNode.type);

        return getNumericContent(nodeMetadata, 'radius')
            || getNumericContent(nodeMetadata, 'structure > radius')
            || RenderContext.tryParseRadius(mapNode.type, /Reveal(\d+)/g)
            || RenderContext.tryParseRadius(mapNode.type, /Obstacle(\d+)/g)
            || RenderContext.tryParseRadius(mapNode.type, /NoBuild(\d+)/g)
            || (mapNode.tag === 'area' ? 16 : null);
    }

    static tryParseRadius(typeName, pattern) {
        let result = pattern.exec(typeName);

        if (!result) {
            return null;
        }

        return +result[1] ?? 0;
    }

    getTexturePath(nodeXml) {
        let src = getTextContent(nodeXml, 'texture');

        if (!src) {
            return null;
        }

        return src.startsWith('data') ? src : 'data/' + src;
    }

    getDefaultFrameBoundsFor(tagName, typeName, nodeXml) {
        let rootNodeXml = this.context.getNodeXmlByName(tagName, typeName);

        if (rootNodeXml !== nodeXml) {
            return this.getFrameBoundsFor(nodeXml, 0);
        }

        let frameIndex = this.getDefaultFrameIndexFor(tagName, typeName);

        return this.getFrameBoundsFor(nodeXml, frameIndex);
    }

    getDefaultFrameIndexFor(tagName, typeName) {
        let nodeMetadata = this.context.getNodeMetadataByName(tagName, typeName);
        let animation = nodeMetadata.querySelector('animation');

        if (!animation) {
            return 0;
        }

        let southAnimation = animation.querySelector('s');
        let standIndex = +southAnimation?.getAttribute('stand');

        return standIndex || 0;
    }

    getFrameBoundsFor(nodeXml, frameIndex) {
        let meshXml = nodeXml.querySelector(':scope mesh');

        let width = getNumericContent(meshXml, 'width');
        let height = getNumericContent(meshXml, 'height');
        let x = getNumericContent(meshXml, 'textureoffsetx', 0);
        let y = getNumericContent(meshXml, 'textureoffsety', 0);

        let texturePath = getTextContent(nodeXml, 'texture');

        if (texturePath) {
            let textureSize = this.context.getImageSize(texturePath);

            if (frameIndex > 0) {
                let framesPerRow = Math.floor(textureSize.width / width);
                let cellX = frameIndex % framesPerRow;
                let cellY = Math.floor(frameIndex / framesPerRow);

                x += cellX * width;
                y += cellY * height;
            }
        }

        return createBoundsWithSize(x, y, width, height);
    }

    getMeshTargetVertices(meshXml) {
        let flipX = getNumericContent(meshXml, 'fliphorizontal', 0);
        let flipY = getNumericContent(meshXml, 'flipvertical', 0);

        if (meshXml.querySelector('vertex1')) {
            let vertices = this.parseMeshVertices(meshXml);

            swapVertices(vertices, flipX, flipY);

            return vertices;
        }

        let width = getNumericContent(meshXml, 'width');
        let height = getNumericContent(meshXml, 'height');
        let anchorX = getNumericContent(meshXml, 'anchorx', width / 2);
        let anchorY = getNumericContent(meshXml, 'anchory', height / 2);
        let boundWidth = getNumericContent(meshXml, 'boundwidth', width);
        let boundHeight = getNumericContent(meshXml, 'boundheight', height);

        let boundScaleX = boundWidth / width;
        let boundScaleY = boundHeight / height;
        let boundAnchorX = anchorX * boundScaleX;
        let boundAnchorY = anchorY * boundScaleY;

        if (flipX) {
            boundAnchorX = boundWidth - boundAnchorX;
        }

        if (flipY) {
            boundAnchorY = boundHeight - boundAnchorY;
        }

        let vertices = createBoxVertices(-boundAnchorX, -boundAnchorY, boundWidth, boundHeight);

        flipVertices(vertices, flipX, flipY);

        return vertices;
    }

    parseMeshVertices(meshXml) {
        let vertex1 = meshXml.querySelector('vertex1');
        let vertex2 = meshXml.querySelector('vertex2');
        let vertex3 = meshXml.querySelector('vertex3');
        let vertex4 = meshXml.querySelector('vertex4');

        return [
            [getNumericContent(vertex1, 'x'), getNumericContent(vertex1, 'y')],
            [getNumericContent(vertex4, 'x'), getNumericContent(vertex4, 'y')],
            [getNumericContent(vertex2, 'x'), getNumericContent(vertex2, 'y')],
            [getNumericContent(vertex3, 'x'), getNumericContent(vertex3, 'y')],
        ];
    }

    getCoordsForNode(tagName, mapNode, nodeXml, hasParent, meshZIndex) {
        let x = 0;
        let y = 0;
        let z = 0;
        let position = nodeXml.querySelector(':scope > position');

        if (position) {
            let decimalZ = getNumericContent(position, 'z', 0);
            let absoluteZ = Math.abs(decimalZ);
            let signZ = z > 0 ? 1 : -1;

            x += Math.ceil(getNumericContent(position, 'x', 0));
            y += Math.ceil(getNumericContent(position, 'y', 0));
            z += -Math.ceil(absoluteZ) * signZ;
        }

        let layerZ = this.getLayerZForTagName(tagName);

        if (hasParent) {
            if (meshZIndex !== null) {
                z += meshZIndex;
            } else {
                z += mapNode.y;
                z += layerZ;
            }

        } else {

            x += mapNode.x;
            y += mapNode.y;
            z += mapNode.y; // Using Y as depth
            z += layerZ;

            if (tagName === 'landmark') {
                let nodeMetadata = this.context.getNodeMetadataByName(tagName, mapNode.type);
                let sublayer = getNumericContent(nodeMetadata, 'sublayer', 0);

                z = layerZ + sublayer;
            }
        }

        return {x, y, z};
    }

    getSelectionBoxZIndex(width, height) {
        let layerZ = 80000;
        let weight = Math.ceil(width + height);

        return layerZ - weight;
    }

    getLayerZForTagName(tagName) {
        let layers = {
            landmark: 10000,
            structure: 20000,
            building: 20000,
            unit: 20000,
            item: 20000,
            chest: 20000,
            area: 30000,
            waypoint: 40000,
            magic: 40000,
            ambient: 40000,
        };

        return layers[tagName];
    }

    getOrderForTagName(tagName) {
        let layers = {
            landmark: 1,
            structure: 2,
            building: 3,
            item: 4,
            chest: 5,
            unit: 6,
            magic: 7,
            ambient: 8,
            waypoint: 9,
            area: 10,
        };

        return layers[tagName];
    }
}