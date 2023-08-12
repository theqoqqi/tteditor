import {combineBounds, createBoundsWithSize, shiftBounds} from '../../../../editor/util/geometry.js';
import {getNumericContent} from '../../../../editor/util/xml.js';
import AbstractView from '../../AbstractView.js';

let ICON_SIZE = 64;

let ICON_PADDING = 0;

// noinspection CssInvalidHtmlTagReference
export default class PaletteView extends AbstractView {

    constructor(editor) {
        super(editor);

        this.$palette = $('#palette');

        this.tabOpenedListener = () => {
        };
        this.selectionChangedListener = () => {
        };
        this.rightClickListener = () => {
        };

        this.bindListeners();
    }

    bindListeners() {
        this.$palette.find('.palette-tab-link').click(e => {
            let $link = $(e.currentTarget);
            let itemListSelector = $link.data('bs-target');
            let $itemList = $(itemListSelector).find('.palette-item-list');
            let tagName = $itemList.data('config-name');

            this.tryInitPaletteItems($itemList);
            this.setSelectedItem(null);
            this.tabOpenedListener(tagName);
        });

        this.$palette.on('click', '.palette-item', e => {
            let $item = $(e.currentTarget);

            this.setSelectedItem($item);
        });

        this.$palette.on('mousedown', '.palette-item', e => {
            if (e.which !== 3) {
                return;
            }

            let $item = $(e.currentTarget);
            let tagName = $item.data('tag-name');
            let typeName = $item.data('type-name');
            let name = $item.data('name');

            this.rightClickListener(tagName, typeName, name, e);
        });

        this.$palette.contextmenu(e => e.shiftKey);
    }

    setSelectionChangedListener(listener) {
        this.selectionChangedListener = listener;
    }

    setTabOpenedListener(listener) {
        this.tabOpenedListener = listener;
    }

    setRightClickListener(listener) {
        this.rightClickListener = listener;
    }

    setSelectedType(tagName, typeName) {
        let $item = this.$palette.find(`.palette-item[data-tag-name='${tagName}'][data-type-name='${typeName}']`);

        this.setSelectedItem($item);
    }

    setSelectedItem($item) {
        this.$palette.find('.palette-item').removeClass('selected');

        if (!$item || !$item.length) {
            this.selectionChangedListener([], null, null, null);
            return;
        }

        let mapNodes = $item.data('map-nodes');
        let tagName = $item.data('tag-name');
        let typeName = $item.data('type-name');
        let name = $item.data('name');

        $item.addClass('selected');

        this.selectionChangedListener(mapNodes, tagName, typeName, name);
    }

    tryInitPaletteItems($itemList) {
        this.initPaletteItemList($itemList);

        $itemList.find('.palette-item').each((index, item) => {
            let $item = $(item);
            if (this.shouldInitPaletteItem($item)) {
                this.initPaletteItem($item);
            }
        });

        setTimeout(() => this.updatePreviewSizes(), 500);
    }

    initPaletteItemList($itemList) {
        if ($itemList.data('filled')) {
            return;
        }

        $itemList.data('filled', true);

        let $paletteTab = $itemList.closest('.palette-tab');
        let configName = $itemList.data('config-name');

        $itemList.detach();

        if (configName === 'magic') {
            this.fillPaletteTriggerList($itemList);
        }

        this.fillPaletteItemList($itemList);

        $paletteTab.on('scroll', e => {
            this.tryInitPaletteItems($itemList);
        });

        $paletteTab.append($itemList);
    }

    fillPaletteItemList($itemList) {
        let configName = $itemList.data('config-name');
        let items = this.getItemListFor(configName);

        for (const item of items) {
            let typeName = item.getAttribute('name');
            let $item = this.createPaletteItem(item, item.tagName, typeName);

            $itemList.append($item);
        }
    }

    fillPaletteTriggerList($itemList) {
        let $items = [
            this.createPaletteItem(null, 'waypoint'),
            this.createPaletteItem(null, 'area'),
            this.createPaletteItem(null, 'area', null, 'startup')
        ];

        for (const $item of $items) {
            $itemList.append($item);
        }
    }

    createPaletteItem(item, tagName, typeName = null, name = null) {
        let $item = $(`
            <div class='palette-item'>
                <div class='palette-item-preview'></div>
                <span class='palette-item-title'>${name ?? typeName ?? tagName}</span>
            </div>
        `);

        if (this.context.isMarkerNode(tagName)) {
            $item.addClass('marker-palette-item');
        }

        $item.data('node-info', item);
        $item.attr('data-name', name);
        $item.attr('data-tag-name', tagName);
        $item.attr('data-type-name', typeName);

        return $item;
    }

    getItemListFor(configName) {
        let config = this.context.getConfigByName(configName);
        let items = config.querySelectorAll(':scope > *');

        return Array.from(items).filter(item => {
            let typeName = item.getAttribute('name');
            let paletteItemNames = this.context.getPaletteItemList(item.tagName);

            return typeName === null || paletteItemNames.includes(typeName);
        });
    }

    shouldInitPaletteItem($item) {
        return !$item.data('init-done') && $item.isInViewport();
    }

    initPaletteItem($item) {
        if ($item.data('init-done')) {
            return;
        }

        $item.data('init-done', true);

        let tagName = $item.data('tag-name');
        let typeName = $item.data('type-name');
        let name = $item.data('name');

        let $preview = $item.find('.palette-item-preview');
        let nodeMetadata = $item.data('node-info');
        let itemNode;

        if (nodeMetadata) {
            itemNode = this.context.getNodeXml(nodeMetadata);
        }

        $item.data('node', itemNode);

        if (this.context.isMarkerNode(tagName)) {
            let $icon = this.createIcon(tagName);
            let mapNode = this.context.createMapNode(0, 0, tagName, typeName, name, true);

            $preview.append($icon);
            $item.data('map-nodes', [mapNode]);

        } else if (tagName === 'terrain') {
            let $mesh = this.createMesh(tagName, typeName, itemNode);

            $preview.append($mesh);

        } else if (tagName === 'composition') {
            let items = nodeMetadata.querySelectorAll(':scope > *');
            let mapNodes = [];

            for (const item of items) {
                let mapNode = this.editor.createMapNodeFromElement(item);
                let $node;

                if (this.context.isMarkerNode(mapNode.tag)) {
                    $node = this.uiNodeFactory.createMarkerNode(mapNode.tag, mapNode.type, mapNode);
                } else {
                    $node = this.uiNodeFactory.createNode(mapNode.tag, mapNode.type, mapNode);
                }

                mapNodes.push(mapNode);
                $preview.append($node);
            }

            $item.data('map-nodes', mapNodes);

        } else {
            let mapNode = this.context.createMapNode(0, 0, tagName, typeName, name, true);
            let $node = this.uiNodeFactory.createNode(tagName, typeName, mapNode);

            $preview.append($node);
            $item.data('map-nodes', [mapNode]);
        }
    }

    createIcon(tagName) {
        let iconClass = this.uiNodeFactory.getIconClassForTagName(tagName);

        return $(`<i class='${iconClass}'>`);
    }

    createMesh(tagName, typeName, itemNode) {
        let $mesh = this.uiNodeFactory.createMesh(tagName, typeName, itemNode);

        if ($mesh.css('background-color')) {
            $mesh.css({
                width: ICON_SIZE + 'px',
                height: ICON_SIZE + 'px',
            });
        }

        return $mesh;
    }

    updatePreviewSizes() {
        this.$palette.find('.palette-item-preview:not([data-size-is-set])').each((index, preview) => {

            let $preview = $(preview);
            let $nodes = $preview.find('> .map-node');
            let $mesh = $preview.find('.mesh, .marker-mesh').first();
            let $paletteItem = $preview.closest('.palette-item');

            if (!$mesh.length || !$mesh[0].getBoundingClientRect().width) {
                return;
            }

            $preview.attr('data-size-is-set', 1);

            let nodeMetadata = $paletteItem.data('node-info');
            let node = $paletteItem.data('node');
            let scale = this.resolveScaleForMesh($mesh, node, nodeMetadata);

            if ($nodes.length) {
                $nodes.each((index, node) => {
                    let $node = $(node);
                    let x = parseFloat($node.css('left'));
                    let y = parseFloat($node.css('top'));

                    $node.css('left', x + ICON_SIZE / 2 + 'px');
                    $node.css('top', y + ICON_SIZE / 2 + 'px');
                });
            } else {
                $mesh.css('left', ICON_SIZE / 2 + 'px');
                $mesh.css('top', ICON_SIZE / 2 + 'px');
            }

            $preview.css('transform', `scale(${scale}, ${scale})`);
        });
    }

    resolveScaleForMesh($mesh, node, nodeMetadata) {

        let rect = $mesh[0].getBoundingClientRect();

        let ratioX = ICON_SIZE / rect.width;
        let ratioY = ICON_SIZE / rect.height;

        if (nodeMetadata.tagName === 'composition') {
            let items = nodeMetadata.querySelectorAll(':scope > *');
            let boundsOfItems = Array.from(items).map(item => {
                let x = +item.getAttribute('x');
                let y = +item.getAttribute('y');
                let bounds = this.getDefaultBoundsFor(item);

                shiftBounds(bounds, x, y);

                return bounds;
            });

            let combinedBounds = combineBounds(boundsOfItems);

            ratioX = ICON_SIZE / combinedBounds.width;
            ratioY = ICON_SIZE / combinedBounds.height;

        } else if (!$mesh.is('.marker-mesh')) {
            let texture = node?.querySelector('texture')?.textContent;

            let imageSize = this.context.getImageSize(texture);
            let imageWidth = imageSize?.width;
            let imageHeight = imageSize?.height;

            let mesh = $mesh.data('mesh');
            let meshWidth = getNumericContent(mesh, 'width');
            let meshHeight = getNumericContent(mesh, 'height');

            ratioX *= imageWidth / meshWidth;
            ratioY *= imageHeight / meshHeight;
        }

        return Math.min(1, ratioX, ratioY);
    }

    getDefaultBoundsFor(item) {
        let tagName = item.tagName;
        let radius = this.uiNodeFactory.getIconRadius(tagName);

        if (this.context.isMarkerNode(tagName)) {
            return createBoundsWithSize(-radius, -radius, radius * 2, radius * 2);
        }

        let typeName = item.getAttribute('type');
        let nodeXml = this.context.getNodeXmlByName(tagName, typeName);

        if (!nodeXml.querySelector(':scope mesh')) {
            return createBoundsWithSize(-radius, -radius, radius * 2, radius * 2);
        }

        return this.uiNodeFactory.getDefaultFrameBoundsFor(tagName, typeName, node);
    }
}