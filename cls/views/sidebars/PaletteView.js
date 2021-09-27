import MapNode from '../../map/MapNode.js';

let ICON_SIZE = 64;
let ICON_PADDING = 0;

// noinspection CssInvalidHtmlTagReference
export default class PaletteView {

    constructor(context, uiNodeFactory) {
        this.context = context;
        this.uiNodeFactory = uiNodeFactory;

        this.$palette = $('#palette');

        this.tabOpenedListener = () => {};
        this.selectionChangedListener = () => {};

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
    }

    setSelectionChangedListener(listener) {
        this.selectionChangedListener = listener;
    }

    setTabOpenedListener(listener) {
        this.tabOpenedListener = listener;
    }

    setSelectedType(tagName, typeName) {
        let $item = this.$palette.find(`.palette-item[data-tag-name='${tagName}'][data-type-name='${typeName}']`);

        this.setSelectedItem($item);
    }

    setSelectedItem($item) {
        this.$palette.find('.palette-item').removeClass('selected');

        if (!$item) {
            this.selectionChangedListener(null, null, null);
            return;
        }

        let tagName = $item.data('tag-name');
        let typeName = $item.data('type-name');
        let name = $item.data('name');

        $item.addClass('selected');

        this.selectionChangedListener(tagName, typeName, name);
    }

    tryInitPaletteItems($itemList) {
        this.initPaletteItemList($itemList);

        $itemList.find('.palette-item').each((index, item) => {
            let $item = $(item);
            if (this.shouldInitPaletteItem($item)) {
                this.initPaletteItem($item)
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

        if (configName === 'trigger') {
            this.fillPaletteTriggerList($itemList);
        } else {
            this.fillPaletteItemList($itemList);
        }

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
            let $item = this.createPaletteItem(item.tagName, typeName);

            $itemList.append($item);
        }
    }

    fillPaletteTriggerList($itemList) {
        let $items = [
            this.createPaletteItem('waypoint'),
            this.createPaletteItem('area'),
            this.createPaletteItem('area', null, 'startup')
        ];

        for (const $item of $items) {
            $itemList.append($item);
        }
    }

    createPaletteItem(tagName, typeName = null, name = null) {
        let $item = $(`
            <div class='palette-item'>
                <div class='palette-item-preview'></div>
                <span class='palette-item-title'>${name ?? typeName ?? tagName}</span>
            </div>
        `);

        if (this.context.isMarkerNode(tagName)) {
            $item.addClass('marker-palette-item');
        }

        $item.attr('data-name', name);
        $item.attr('data-tag-name', tagName);
        $item.attr('data-type-name', typeName);

        return $item;
    }

    getItemListFor(configName) {
        let config = this.context.getConfigByName(configName);
        let items = config.querySelectorAll('*');

        return Array.from(items).filter(item => {
            let typeName = item.getAttribute('name');
            let paletteItemNames = this.context.getPaletteItemList(item.tagName);

            return paletteItemNames.includes(typeName);
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
        let $preview = $item.find('.palette-item-preview');
        let nodeInfo = this.context.getNodeInfoByName(tagName, typeName);
        let itemNode;

        if (nodeInfo) {
            itemNode = this.context.getNodeXml(nodeInfo);
        }

        if (this.context.isMarkerNode(tagName)) {
            let $icon = this.createIcon(tagName);

            $preview.append($icon);

        } else if (tagName === 'terrain') {
            let $mesh = this.createMesh(tagName, typeName, itemNode);

            $preview.append($mesh);

        } else {
            let mapNode = new MapNode(tagName, 0, 0, true);
            let $node = this.uiNodeFactory.createNode(tagName, typeName, mapNode);

            $preview.append($node);
        }

        $item.data('node', itemNode);
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
                left: ICON_SIZE / 2 + ICON_PADDING + 'px',
                top: ICON_SIZE / 2 + ICON_PADDING + 'px',
            });
        }

        return $mesh;
    }

    updatePreviewSizes() {
        this.$palette.find('.palette-item-preview:not([data-size-is-set])').each((index, preview) => {

            let $preview = $(preview);
            let $mesh = $preview.find('.mesh');
            let $paletteItem = $preview.closest('.palette-item');

            if (!$mesh.length || !$mesh[0].getBoundingClientRect().width) {
                return;
            }

            $preview.attr('data-size-is-set', 1);

            let node = $paletteItem.data('node');
            let scale = this.resolveScaleForMesh($mesh, node);

            $mesh.css('transform', 'translate(32px, 32px) ' + $mesh.css('transform'));
            $preview.css('transform', `scale(${scale}, ${scale})`);
        });
    }

    resolveScaleForMesh($mesh, node) {
        let texture = node.querySelector('texture')?.textContent;

        let imageSize = this.context.getImageSize(texture);
        let imageWidth = imageSize?.width;
        let imageHeight = imageSize?.height;

        let mesh = $mesh.data('mesh');
        let meshWidth = mesh.getNumericContentOf('width');
        let meshHeight = mesh.getNumericContentOf('height');

        let rect = $mesh[0].getBoundingClientRect();
        let ratioX = ICON_SIZE / rect.width * (imageWidth / meshWidth);
        let ratioY = ICON_SIZE / rect.height * (imageHeight / meshHeight);

        return Math.min(1, ratioX, ratioY);
    }
}