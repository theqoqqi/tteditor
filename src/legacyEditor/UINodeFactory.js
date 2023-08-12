import {getNumericContent, getTextContent} from '../editor/util/xml.js';
import {
    colorToCssRgba,
    hexIntColorToColor,
    hsbaColorToCssFilters,
    rgbaColorToHsbaColor
} from '../editor/util/colors.js';
import {
    createBoundsWithSize,
    createBoxVertices,
    flipVertices,
    swapVertices,
    verticesToBounds
} from '../editor/util/geometry.js';
import applyTransform from '../editor/util/matrix.js';

let COORDS_RATIO = 78 / 128;

// noinspection CssInvalidHtmlTagReference
export default class UINodeFactory {

    constructor(context) {
        this.context = context;
    }

    createMarkerNode(tagName, typeName, mapNode) {
        let $node = this.createGenericNode(tagName, mapNode);
        let x = mapNode.x;
        let y = mapNode.y;
        let z = 0;
        let layerZ = this.getLayerZForTagName(tagName);
        let iconRadius = this.getIconRadius(mapNode.tag);
        let { radiusX, radiusY } = this.getAreaRadiusSizesFor(mapNode);

        x -= radiusX;
        y -= radiusY;
        z -= radiusX;
        z += layerZ;

        this.storeNodeProperties($node, mapNode);

        $node.addClass('marker-map-node');
        $node.css('left', x + radiusX + 'px');
        $node.css('top', y + radiusY + 'px');

        if (radiusX && radiusY) {
            let $areaMesh = this.createMarkerMesh('area-mesh', radiusX, radiusY);

            $areaMesh.css('z-index', z);
            $node.append($areaMesh);
        }

        if (iconRadius) {
            let $iconMesh = this.createMarkerMesh('icon-mesh', iconRadius, iconRadius);
            let $icon = this.createMarkerIcon(tagName);

            $iconMesh.css('z-index', z);
            $iconMesh.append($icon);
            $node.append($iconMesh);
        }

        let $nameMesh = this.createMarkerMesh(iconRadius ? 'icon-name-mesh' : 'name-mesh');

        $nameMesh.css('z-index', z);
        $nameMesh.text(mapNode.name || mapNode.type);
        $node.append($nameMesh);

        let boxRadiusX = iconRadius || radiusX;
        let boxRadiusY = iconRadius || radiusY;
        let $selectionBox = this.createMarkerSelectionBox(mapNode, boxRadiusX, boxRadiusY);
        let selectionBoxZ = this.getSelectionBoxZIndex(tagName, x, y, z, boxRadiusX * 2, boxRadiusY * 2);

        $selectionBox.css('z-index', selectionBoxZ);
        $node.append($selectionBox);

        return $node;
    }

    createMarkerMesh(meshClass, radiusX, radiusY) {
        let $markerMesh = $(`<div class='marker-mesh ${meshClass}'>`);

        $markerMesh.css('left', -radiusX + 'px');
        $markerMesh.css('top', -radiusY + 'px');
        $markerMesh.css('width', radiusX * 2 + 'px');
        $markerMesh.css('height', radiusY * 2 + 'px');

        return $markerMesh;
    }

    createNode(tagName, typeName, mapNode, $parentNode = null, nodeXml = null) {
        nodeXml ??= this.context.getNodeXmlByName(tagName, typeName);

        try {
            let $node = this.createGenericNode(tagName, mapNode, nodeXml, $parentNode);
            let { x, y, z } = this.getCoordsForNode(tagName, mapNode, nodeXml, $parentNode);

            this.storeNodeProperties($node, mapNode);

            $node.css('left', x + 'px');
            $node.css('top', y + 'px');

            if (mapNode.hint) {
                let path = mapNode.hint;
                path = path.startsWith('$hierarchy') ? path : '$hierarchy.Hint.' + path;
                $node.attr('title', this.context.getLocalizedString(path));
            }

            let $mesh;

            if (nodeXml.querySelector(':scope > mesh')) {
                $mesh = this.createMesh(tagName, typeName, nodeXml);

                if (nodeXml.querySelector(':scope > keyframe')) {
                    console.warn('node with keyframe:', nodeXml, tagName, mapNode);
                }
            }

            if (!$parentNode && !$mesh && !nodeXml.querySelector('mesh')) {
                $mesh = this.createMarkerMesh('icon-mesh', 12, 12);

                let $icon = this.createMarkerIcon(tagName);

                $mesh.append($icon);

                let { radiusX, radiusY } = this.getAreaRadiusSizesFor(mapNode);

                if (radiusX && radiusY) {
                    let $areaMesh = this.createMarkerMesh('area-mesh', radiusX, radiusY);

                    $areaMesh.css('z-index', z);
                    $node.append($areaMesh);
                }
            }

            if ($mesh) {
                $mesh.css('z-index', z);
                $node.append($mesh);
            }

            for (let subNode of nodeXml.querySelectorAll(':scope > node')) {
                let $subNode = this.createNode(tagName, typeName, mapNode, $node, subNode);
                $node.append($subNode);
            }

            if (!$parentNode && !mapNode.isFake) {

                let $firstMesh = this.getMeshForSelection($node);

                if ($firstMesh) {
                    let $selectionBox;
                    let selectionBoxZ;

                    if ($firstMesh.is('.marker-mesh')) {
                        let width = $firstMesh.width();
                        let height = $firstMesh.height();

                        $selectionBox = this.createMarkerSelectionBox(mapNode, width / 2, height / 2);
                        selectionBoxZ = this.getSelectionBoxZIndex(tagName, x, y, z, width, height);

                    } else {
                        let width = $firstMesh.data('width');
                        let height = $firstMesh.data('height');

                        $selectionBox = this.createMeshSelectionBox($node, $firstMesh, mapNode);
                        selectionBoxZ = this.getSelectionBoxZIndex(tagName, x, y, z, width, height);
                    }

                    $selectionBox.css('z-index', selectionBoxZ);
                    $node.append($selectionBox);
                } else {
                    console.error('Unable to create selection box: no mesh', $node, nodeXml, tagName, mapNode);
                }
            }

            return $node;
        } catch (e) {
            console.error(e);
            console.log(tagName, nodeXml, mapNode);
            return null;
        }
    }

    getMeshForSelection($node) {
        // Адекватного способа объединить 3+ jQuery-массива нет, а нам необходимо искать именно в таком порядке.

        return $.merge(
            $.merge(
                $node.find('.mesh'),
                $node.find('.marker-mesh.icon-mesh')
            ),
            $.merge(
                $node.find('.marker-mesh.area-mesh'),
                $node.find('.marker-mesh.fallback-mesh')
            )
        ).first();
    }

    createGenericNode(tagName, mapNode, node = null, $parentNode = null) {
        let $node = $(`<div class="map-node ${tagName}">`);

        $node.attr('data-editor-id', mapNode.editorId);
        $node.data('map-node', mapNode);
        $node.data('node', node);

        if (!$parentNode) {
            $node.addClass('map-node-root');
        }

        return $node;
    }

    createMesh(tagName, typeName, nodeXml = null) {
        nodeXml ??= this.context.getNodeXmlByName(tagName, typeName);

        let mesh = nodeXml.querySelector(':scope > mesh');

        if (!getNumericContent(mesh, 'width') || !getNumericContent(mesh, 'height')) {
            return null;
        }

        if (!nodeXml.querySelector(':scope > texture')) {
            let width = getNumericContent(mesh, 'width');
            let height = getNumericContent(mesh, 'height');
            let color = getTextContent(mesh, 'color');

            let $markerMesh = this.createMarkerMesh('fallback-mesh', width / 2, height / 2);

            $markerMesh.css('background-color', colorToCssRgba(hexIntColorToColor(color)));

            return $markerMesh;
        }

        let frameBounds = this.getDefaultFrameBoundsFor(tagName, typeName, nodeXml);
        let offsetX = frameBounds.x;
        let offsetY = frameBounds.y;
        let width = frameBounds.width;
        let height = frameBounds.height;

        let $mesh;

        let src = getTextContent(nodeXml, 'texture');
        if (src) {
            src = src.startsWith('data') ? src : 'data/' + src;
            $mesh = $(`<img class="mesh" alt="" src="${src}" />`);
        } else {
            $mesh = $('<img class="mesh" alt="" src="/img/empty.png" >');
        }

        $mesh.data('mesh', mesh);

        let color = getTextContent(nodeXml, 'mesh > color');

        if (color) {
            let rgba = hexIntColorToColor(color);

            if (src) {
                let hsba = rgbaColorToHsbaColor(rgba);
                let cssFilters = hsbaColorToCssFilters(hsba);

                $mesh.css('filter', cssFilters);
            } else {
                $mesh.css('background-color', colorToCssRgba(rgba));
            }
        }

        $mesh.css('clip', `rect(${offsetY}px, ${offsetX + width}px, ${offsetY + height}px, ${offsetX}px)`);
        $mesh.css('left', `${-offsetX}px`);
        $mesh.css('top', `${-offsetY}px`);
        $mesh.data('width', width);
        $mesh.data('height', height);

        let initialVertices = createBoxVertices(0, 0, width, height);
        let targetVertices = this.getMeshTargetVertices(mesh);

        applyTransform($mesh[0], initialVertices, targetVertices);

        $mesh.css('transform-origin', `${offsetX}px ${offsetY}px`);
        $mesh.data('initial-vertices', initialVertices);
        $mesh.data('target-vertices', targetVertices);

        return $mesh;
    }

    createMeshSelectionBox($node, $mesh, mapNode) {
        let targetVertices = $mesh.data('target-vertices');
        let meshBounds = verticesToBounds(targetVertices);

        return this.createSelectionBox(mapNode, meshBounds.x, meshBounds.y, meshBounds.width, meshBounds.height);
    }

    createMarkerSelectionBox(mapNode, radiusX, radiusY) {
        return this.createSelectionBox(mapNode, -radiusX, -radiusY, radiusX * 2, radiusY * 2);
    }

    createSelectionBox(mapNode, x, y, w, h) {
        let $box = $(`<div class='selection-box' data-map-node-editor-id='${mapNode.editorId}'>`);

        $box.css({
            width: `${w}px`,
            height: `${h}px`,
            left: `${x}px`,
            top: `${y}px`,
        });

        return $box;
    }

    createMarkerIcon(tagName) {
        let iconClass = this.getIconClassForTagName(tagName);

        return $(`<i class='${iconClass}'>`);
    }

    storeNodeProperties($node, mapNode) {
        let propertyNames = ['x', 'y', 'radius', 'hint'];

        for (const propertyName of propertyNames) {
            $node.data(`property-${propertyName}`, mapNode[propertyName]);
        }
    }

    setNodeProperty($node, propertyName, newValue) {
        let oldValue = $node.data(`property-${propertyName}`);
        let difference = newValue - oldValue;

        $node.data(`property-${propertyName}`, newValue);

        if (propertyName === 'x') {
            this.#moveNodeBy($node, difference, 0);
        }

        if (propertyName === 'y') {
            this.#moveNodeBy($node, 0, difference);
        }

        if (propertyName === 'radius') {
            let mapNode = $node.data('map-node');
            let applyRatio = mapNode.tag === 'area';
            let $sizedElements = $node.find('> .marker-mesh, > .selection-box');
            let { radiusX: differenceX, radiusY: differenceY } = this.getRadiusSizes(difference, applyRatio);

            this.#increaseCssPixels($sizedElements, 'left', -differenceX / 2);
            this.#increaseCssPixels($sizedElements, 'top', -differenceY / 2);
            this.#increaseCssPixels($sizedElements, 'width', differenceX);
            this.#increaseCssPixels($sizedElements, 'height', differenceY);
        }

        if (propertyName === 'hint') {
            $node.attr('title', newValue);
        }

        if (propertyName === 'name') {
            let mapNode = $node.data('map-node');

            $node.find('.name-mesh').text(newValue || mapNode.type);
        }
    }

    #moveNodeBy($node, x, y) {
        if (x !== 0) {
            this.#increaseCssPixels($node, 'left', x);
        }
        if (y !== 0) {
            this.#increaseCssPixels($node, 'top', y);

            let mapNode = $node.data('map-node');

            if (mapNode.tag !== 'landmark') {
                let $model = $node.find('> .mesh, > i');
                let zIndex = +$model.css('z-index');

                if (zIndex) {
                    $model.css('z-index', zIndex + y);
                }
            }
        }
    }

    #increaseCssPixels($elements, property, increaseBy) {
        $elements.each((index, element) => {
            let $element = $(element);
            let oldLeft = this.cssPixelsToNumber($element.css(property));

            $element.css(property, `${oldLeft + increaseBy}px`);
        });
    }
}