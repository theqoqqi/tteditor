
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
        let {radiusX, radiusY} = this.getInitialRadiusSizesFor(mapNode);

        x -= radiusX;
        y -= radiusY;
        z -= radiusX;
        z += layerZ;

        this.storeNodeProperties($node, mapNode);

        $node.addClass('marker-map-node');
        $node.css('left', x + radiusX + 'px');
        $node.css('top', y + radiusY + 'px');

        let $markerMesh = this.createMarkerMesh(radiusX, radiusY);

        $markerMesh.css('z-index', z);
        $node.append($markerMesh);

        if (tagName !== 'area') {
            let $icon = this.createMarkerIcon(tagName);

            $markerMesh.append($icon);
        }

        let $selectionBox = this.createMarkerSelectionBox(mapNode, radiusX, radiusY);
        let selectionBoxZ = this.getSelectionBoxZIndex(tagName, x, y, z, radiusX * 2, radiusY * 2);

        $selectionBox.css('z-index', selectionBoxZ);
        $node.append($selectionBox);

        return $node;
    }

    getInitialRadiusSizesFor(mapNode) {
        let declaredRadius = this.getDeclaredRadius(mapNode);
        let applyRatio = mapNode.tag === 'area';

        if (!declaredRadius) {
            declaredRadius = mapNode.tag === 'waypoint' ? 8 : 12;
        }

        return this.getRadiusSizes(declaredRadius, applyRatio);
    }

    getRadiusSizes(radius, applyRatio) {
        let radiusX, radiusY;

        if (applyRatio) {
            radiusX = radius;
            radiusY = radiusX * COORDS_RATIO;
        } else {
            radiusX = radius;
            radiusY = radius;
        }

        return {radiusX, radiusY};
    }

    createMarkerMesh(radiusX, radiusY) {
        let $markerMesh = $(`<div class='marker-mesh'>`);

        $markerMesh.css('left', -radiusX + 'px');
        $markerMesh.css('top', -radiusY + 'px');
        $markerMesh.css('width', radiusX * 2 + 'px');
        $markerMesh.css('height', radiusY * 2 + 'px');

        return $markerMesh;
    }

    getDeclaredRadius(mapNode) {
        if (mapNode.radius) {
            return mapNode.radius / 2;
        }

        // TODO: радиус для Reveal200?

        return null;
    }

    createNode(tagName, typeName, mapNode, $parentNode = null, node = null) {
        node ??= this.context.getNodeByName(tagName, typeName);

        try {
            let $node = this.createGenericNode(tagName, mapNode, node, $parentNode);
            let {x, y, z} = this.getCoordsForNode(tagName, mapNode, node, $parentNode);

            this.storeNodeProperties($node, mapNode);

            $node.css('left', x + 'px');
            $node.css('top', y + 'px');

            if (mapNode.hint) {
                let path = mapNode.hint;
                path = path.startsWith('$hierarchy') ? path : '$hierarchy.Hint.' + path;
                $node.attr('title', this.context.getLocalizedString(path));
            }

            let $mesh;

            if (node.querySelector(':scope > mesh')) {

                $mesh = this.createMesh(tagName, typeName, node);

                if (node.querySelector(':scope > keyframe')) {
                    console.warn('node with keyframe:', node, tagName, mapNode);
                }
            }

            if (!$parentNode && !$mesh && !node.querySelector('mesh')) {
                $mesh = this.createMarkerMesh(12, 12);

                let $icon = this.createMarkerIcon(tagName);

                $mesh.append($icon);
            }

            if ($mesh) {
                $mesh.css('z-index', z);
                $node.append($mesh);
            }

            for (let subNode of node.querySelectorAll(':scope > node')) {
                let $subNode = this.createNode(tagName, typeName, mapNode, $node, subNode);
                $node.append($subNode);
            }

            if (!$parentNode && !mapNode.isFake) {

                let $firstMesh = $node.find('.mesh, .marker-mesh').first();

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
                    console.error('Unable to create selection box: no mesh', $node, node, tagName, mapNode);
                }
            }

            return $node;
        } catch (e) {
            console.error(e);
            console.log(tagName, node, mapNode);
            return null;
        }
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

    createMesh(tagName, typeName, node = null) {
        node ??= this.context.getNodeByName(tagName, typeName);

        let mesh = node.querySelector(':scope > mesh');

        if (!mesh.getNumericContentOf('width') || !mesh.getNumericContentOf('height')) {
            return null;
        }

        if (!node.querySelector(':scope > texture')) {
            let width = mesh.getNumericContentOf('width');
            let height = mesh.getNumericContentOf('height');
            let color = mesh.getTextContentOf('color');

            let $markerMesh = this.createMarkerMesh(width / 2, height / 2);

            $markerMesh.css('background-color', colorToCssRgba(hexIntColorToColor(color)));

            return $markerMesh;
        }

        let frameBounds = this.getDefaultFrameBoundsFor(tagName, typeName, node);
        let offsetX = frameBounds.x;
        let offsetY = frameBounds.y;
        let width = frameBounds.width;
        let height = frameBounds.height;

        let $mesh;

        let src = node.getTextContentOf('texture');
        if (src) {
            src = src.startsWith('data') ? src : 'data/' + src;
            $mesh = $(`<img class="mesh" alt="" src="${src}" />`);
        } else {
            $mesh = $('<img class="mesh" alt="" src="/img/empty.png" >');
        }

        $mesh.data('mesh', mesh);

        let color = node.getTextContentOf('mesh > color');
        if (color) {
            if (src) {
                // Add the tint to texture? It's hard with CSS
            } else {
                $mesh.css('background-color', colorToCssRgba(hexIntColorToColor(color)))
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

    getDefaultFrameBoundsFor(tagName, typeName, node) {
        let rootNode = this.context.getNodeByName(tagName, typeName);

        if (rootNode !== node) {
            return this.getFrameBoundsFor(node, 0);
        }

        let frameIndex = this.getDefaultFrameIndexFor(tagName, typeName);

        return this.getFrameBoundsFor(node, frameIndex);
    }

    getDefaultFrameIndexFor(tagName, typeName) {
        let nodeInfo = this.context.getNodeInfoByName(tagName, typeName);
        let animation = nodeInfo.querySelector('animation');

        if (!animation) {
            return 0;
        }

        let southAnimation = animation.querySelector('s');
        let standIndex = +southAnimation?.getAttribute('stand');

        return standIndex || 0;
    }

    getFrameBoundsFor(node, frameIndex) {
        let mesh = node.querySelector(':scope > mesh');

        let width = mesh.getNumericContentOf('width');
        let height = mesh.getNumericContentOf('height');
        let x = mesh.getNumericContentOf('textureoffsetx', 0);
        let y = mesh.getNumericContentOf('textureoffsety', 0);

        let texturePath = node.getTextContentOf('texture');

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

    getMeshTargetVertices(mesh) {
        if (mesh.querySelector('vertex1')) {
            return this.parseMeshVertices(mesh);
        }

        let width = mesh.getNumericContentOf('width');
        let height = mesh.getNumericContentOf('height');
        let anchorX = mesh.getNumericContentOf('anchorx', width / 2);
        let anchorY = mesh.getNumericContentOf('anchory', height / 2);
        let flipX = mesh.getNumericContentOf('fliphorizontal', 0);
        let flipY = mesh.getNumericContentOf('flipvertical', 0);
        let boundWidth = mesh.getNumericContentOf('boundwidth', width);
        let boundHeight = mesh.getNumericContentOf('boundheight', height);

        let boundScaleX = boundWidth / width;
        let boundScaleY = boundHeight / height;
        let boundAnchorX = anchorX * boundScaleX;
        let boundAnchorY = anchorY * boundScaleY;

        let vertices = createBoxVertices(-boundAnchorX, -boundAnchorY, boundWidth, boundHeight);

        flipVertices(vertices, flipX, flipY);

        return vertices;
    }

    parseMeshVertices(mesh) {
        let vertex1 = mesh.querySelector('vertex1');
        let vertex2 = mesh.querySelector('vertex2');
        let vertex3 = mesh.querySelector('vertex3');
        let vertex4 = mesh.querySelector('vertex4');

        return [
            [vertex1.getNumericContentOf('x'), vertex1.getNumericContentOf('y')],
            [vertex4.getNumericContentOf('x'), vertex4.getNumericContentOf('y')],
            [vertex2.getNumericContentOf('x'), vertex2.getNumericContentOf('y')],
            [vertex3.getNumericContentOf('x'), vertex3.getNumericContentOf('y')],
        ];
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
            let {radiusX: differenceX, radiusY: differenceY} = this.getRadiusSizes(difference, applyRatio);

            this.#increaseCssPixels($sizedElements, 'left', -differenceX / 2);
            this.#increaseCssPixels($sizedElements, 'top', -differenceY / 2);
            this.#increaseCssPixels($sizedElements, 'width', differenceX);
            this.#increaseCssPixels($sizedElements, 'height', differenceY);
        }

        if (propertyName === 'hint') {
            $node.attr('title', newValue);
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

    cssPixelsToNumber(cssPixels) {
        return +cssPixels.substring(0, cssPixels.indexOf('px'));
    }

    getCoordsForNode(tagName, mapNode, node, $parentNode) {
        let x = 0;
        let y = 0;
        let z = 0;
        let position = node.querySelector(':scope > position');

        if (position) {
            let decimalZ = position.getNumericContentOf('z', 0);
            let absoluteZ = Math.abs(decimalZ);
            let signZ = z > 0 ? 1 : -1;

            x += Math.ceil(position.getNumericContentOf('x', 0));
            y += Math.ceil(position.getNumericContentOf('y', 0));
            z += -Math.ceil(absoluteZ) * signZ;
        }

        let layerZ = this.getLayerZForTagName(tagName);

        if ($parentNode) {
            let $mesh = $parentNode.find('> .mesh');
            if ($mesh.length) {
                z += +$mesh.css('z-index');
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
                z = layerZ;
            }
        }

        return {x, y, z};
    }

    getSelectionBoxZIndex(tagName, x, y, z, width, height) {
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

    getOrderTagName(tagName) {
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

    getIconClassForTagName(tagName) {
        let iconClassesByTagNames = {
            terrain: 'bi-square-fill',
            landmark: 'bi-layers-fill',
            structure: 'bi-tree-fill',
            building: 'bi-house-fill',
            unit: 'bi-person-fill',
            item: 'bi-search',
            chest: 'bi-lock-fill',
            magic: 'bi-stars',
            ambient: 'bi-volume-up',
            waypoint: 'bi-record2',
            area: 'bi-circle',
        };

        return iconClassesByTagNames[tagName];
    }
}