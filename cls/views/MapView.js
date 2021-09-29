
export default class MapView {

    constructor(context) {
        this.context = context;
        this.uiNodeFactory = context.getUiNodeFactory();

        this.$mapScroll = $('.map-scroll');
        this.$map = $('.map');
        this.$mapNodeList = $('.map-node-list');
        this.$mapScrollOverlay = $('.map-scroll-overlay');

        this.$mapScroll.attr('tabindex', -1);

        this.scrollPadding = 300;

        // BUG: Элемент с mix-blend-mode вызывает глитчи в интерфейсе, на местах, где нет background-color/image,
        // поэтому просто удаляю этот элемент, чтобы эта фича не работала, но код для нее остался.
        // this.$mapScrollOverlay.remove();

        this.clickListener = () => {};
        this.doubleClickListener = () => {};
        this.mouseMoveListener = () => {};
        this.moveActionListener = () => {};
        this.dragNodesListener = () => {};

        this.bindListeners();
        this.createScrollController();
    }

    bindListeners() {
        this.$map.on('mousedown', '.map-node .selection-box', e => {
            this.$map.data('should-process-click', true);
        });

        this.$map.on('mousemove', e => {
            this.$map.data('should-process-click', false);
        });

        this.$map.on('click', e => {
            if (!this.$map.data('should-process-click')) {
                return;
            }

            let $node = $(e.target).closest('.map-node-root');
            let mapNode = $node.data('map-node');

            this.clickListener(mapNode, e);

            this.$mapScroll.focus();
        });

        this.$map.on('dblclick', e => {
            let $node = $(e.target).closest('.map-node-root');
            let mapNode = $node.data('map-node');

            this.doubleClickListener(mapNode);
        });

        this.$mapScroll.mousemove(e => {
            let mapOffset = this.$map.offset();
            let x = e.pageX - mapOffset.left;
            let y = e.pageY - mapOffset.top;

            this.mouseMoveListener(x, y);
        });

        this.$mapScroll.on('keydown', e => {
            let code = e.code;

            if (!code) {
                return;
            }

            if (code.startsWith('Arrow')) {
                e.preventDefault();

                let x = (code === 'ArrowRight') - (code === 'ArrowLeft');
                let y = (code === 'ArrowDown') - (code === 'ArrowUp');
                let multiplier = 5;

                if (e.shiftKey) {
                    x *= multiplier;
                    y *= multiplier;
                }

                if (e.ctrlKey) {
                    x *= multiplier;
                    y *= multiplier;
                }

                if (!e.altKey) {
                    x *= multiplier;
                    y *= multiplier;
                }

                this.moveActionListener(x, y);
            }
        });
    }

    createScrollController() {
        let $draggedNode = null;
        let lastDragOffset = {x: 0, y: 0};

        // noinspection JSUnusedGlobalSymbols
        this.scrollController = new ScrollBooster({
            viewport: this.$mapScroll[0],
            scrollMode: 'native',
            friction: 0,
            bounce: false,
            onPointerDown: (state, e) => {
                if (e.button === 1) {
                    this.scrollController.props.friction = 0;

                } else if (e.button === 0) {
                    this.scrollController.props.friction = 1;

                    let $node = this.getNodeFromEvent(e);

                    if ($node?.is('.selected')) {
                        $draggedNode = $node;
                    }
                }
            },
            onPointerUp: (state, e) => {
                if (e.button === 1) {
                    this.scrollController.props.friction = 1;

                } else if (e.button === 0) {
                    this.scrollController.props.friction = 1;
                    $draggedNode = null;
                    lastDragOffset = {x: 0, y: 0};
                }
            },
            onPointerMove: (state, e) => {
                if ($draggedNode) {
                    let movedBy = {
                        x: state.dragOffset.x - lastDragOffset.x,
                        y: state.dragOffset.y - lastDragOffset.y,
                    };
                    lastDragOffset = {...state.dragOffset};

                    this.dragNodesListener(movedBy.x, movedBy.y);
                }
            },
        });
    }

    setClickListener(listener) {
        this.clickListener = listener;
    }

    setDoubleClickListener(listener) {
        this.doubleClickListener = listener;
    }

    setMouseMoveListener(listener) {
        this.mouseMoveListener = listener;
    }

    setDragNodesListener(listener) {
        this.dragNodesListener = listener;
    }

    setMoveActionListener(listener) {
        this.moveActionListener = listener;
    }

    addNode(mapNode) {
        let $node;

        if (this.context.isMarkerNode(mapNode.tag)) {
            $node = this.uiNodeFactory.createMarkerNode(mapNode.tag, mapNode.type, mapNode);
        } else {
            $node = this.uiNodeFactory.createNode(mapNode.tag, mapNode.type, mapNode);
        }

        this.$mapNodeList.append($node);
    }

    removeNode(mapNode) {
        this.findMapNodeElement(mapNode).remove();
    }

    clearNodes() {
        this.$mapNodeList.empty();
    }

    setSelectedNodes(mapNodes) {
        let editorIds = mapNodes.map(mapNode => mapNode.editorId);

        this.$map.find('.map-node').each((index, nodeElement) => {
            let $node = $(nodeElement);
            let nodeEditorId = +$node.data('editor-id');

            $node.toggleClass('selected', editorIds.includes(nodeEditorId));
        });
    }

    moveNodeBy(mapNode, x, y) {
        let $node = this.findMapNodeElement(mapNode);

        this.uiNodeFactory.moveNodeBy($node, x, y);
    }

    setNodeVisible(mapNode, isVisible) {
        let $node = this.findMapNodeElement(mapNode);

        $node.toggleClass('hidden', !isVisible);
    }

    setNodeProperty(mapNode, propertyName, newValue) {
        let $node = this.findMapNodeElement(mapNode);

        this.uiNodeFactory.setNodeProperty($node, propertyName, newValue);
    }

    setAllLayersActive() {
        let allLayerNames = this.context.getLayerTagNames();

        this.setActiveLayers(allLayerNames);
    }

    setActiveLayers(layerNames) {
        let allLayerNames = this.context.getLayerTagNames();

        for (const layerName of allLayerNames) {
            let layerClass = `${layerName}-layer-active`;
            this.$map.toggleClass(layerClass, layerNames.includes(layerName));
        }
    }

    setFowClearColor(color) {
        this.$mapScrollOverlay.toggle(color !== null);
        this.$mapScrollOverlay.css('background-color', color ? colorToCssRgba(color) : null);
    }

    setTerrain(terrain) {
        this.$map.css('background-image', 'none');
        this.$map.css('background-color', 'none');

        if (terrain.texture) {
            this.$map.css('background-image', `url('data${terrain.texture}')`);
        }

        if (terrain.color) {
            this.$map.css('background-color', colorToCssRgba(terrain.color));
        }

        this.$map.css('background-size', `${terrain.width}px ${terrain.height}px`);
    }

    setMapSize(width, height) {
        this.setMapWidth(width);
        this.setMapHeight(height);
    }

    setMapWidth(width) {
        this.$map.css('width', width + 'px');
    }

    setMapHeight(height) {
        this.$map.css('height', height + 'px');
    }

    setViewportCenter(x, y) {
        let viewportWidth = this.$mapScroll.width();
        let viewportHeight = this.$mapScroll.height();

        this.$mapScroll.scrollLeft(x - viewportWidth / 2 + this.scrollPadding);
        this.$mapScroll.scrollTop(y - viewportHeight / 2 + this.scrollPadding);
    }

    getViewportPosition() {
        return {
            x: this.$mapScroll.scrollLeft() - this.scrollPadding,
            y: this.$mapScroll.scrollTop() - this.scrollPadding,
        };
    }

    getNodeFromEvent(e) {
        let $selectionBox = $(e.target);

        if (!$selectionBox.is('.selection-box')) {
            return null;
        }

        return $selectionBox.closest('.map-node-root');
    }

    findMapNodeElement(mapNode) {
        return this.$map.find(`.map-node.map-node-root[data-editor-id='${mapNode.editorId}']`);
    }
}