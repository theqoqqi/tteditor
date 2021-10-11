import CompositeObserver from '../util/CompositeObserver.js';

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

        this.clickListener = () => {};
        this.rightClickListener = () => {};
        this.doubleClickListener = () => {};
        this.mouseMoveListener = () => {};
        this.moveActionListener = () => {};
        this.dragNodesStartedListener = () => {};
        this.dragNodesListener = () => {};

        this.createMapObservers();
        this.createMapNodeObservers();

        this.bindListeners();
        this.createScrollComponent();
    }

    createMapObservers() {
        this.mapObservers = new CompositeObserver();

        this.mapObservers.addPropertyObserver('width', width => {
            this.setMapWidth(width);
        });

        this.mapObservers.addPropertyObserver('height', height => {
            this.setMapHeight(height);
        });

        this.mapObservers.addPropertyObserver('terrain', terrain => {
            this.setTerrain(terrain);
        });

        this.mapObservers.addPropertyObserver('options.fowClearColor', fowClearColor => {
            this.setFowClearColor(fowClearColor);
        });

        this.mapObservers.addPropertyObserver('nodes', mapNodes => {
            this.clearNodes();
            for (const mapNode of mapNodes) {
                this.addNode(mapNode);
            }
        });

        this.mapObservers.addElementAddedObserver('nodes', mapNode => {
            this.addNode(mapNode);
        });

        this.mapObservers.addElementRemovedObserver('nodes', mapNode => {
            this.removeNode(mapNode);
        });
    }

    createMapNodeObservers() {
        this.mapNodeObservers = new CompositeObserver();

        this.addMapNodePropertyObserver('x');
        this.addMapNodePropertyObserver('y');
        this.addMapNodePropertyObserver('radius');
        this.addMapNodePropertyObserver('hint');
    }

    addMapNodePropertyObserver(propertyName) {
        this.mapNodeObservers.addPropertyObserver(propertyName, (value, mapNode) => {
            this.setNodeProperty(mapNode, propertyName, value);
        });
    }

    bindListeners() {
        this.$map.on('mousedown', e => {
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

        this.$map.on('mousedown', e => {

            if (e.which !== 3) {
                return;
            }

            let $node = $(e.target).closest('.map-node-root');
            let mapNode = $node.data('map-node');

            e.preventDefault();

            this.rightClickListener(mapNode, e);

            this.$mapScroll.focus();
        });

        // this.$map.contextmenu(e => false);

        this.$map.on('dblclick', e => {
            let $node = $(e.target).closest('.map-node-root');
            let mapNode = $node.data('map-node');

            this.doubleClickListener(mapNode, e);
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

    createScrollComponent() {
        let $draggedNode = null;
        let lastDragOffset = {x: 0, y: 0};

        // noinspection JSUnusedGlobalSymbols
        this.scrollComponent = new ScrollBooster({
            viewport: this.$mapScroll[0],
            scrollMode: 'native',
            friction: 0,
            bounce: false,
            onPointerDown: (state, e) => {
                if (e.button === 1) {
                    this.scrollComponent.props.friction = 0;

                } else if (e.button === 0) {
                    this.scrollComponent.props.friction = 1;

                    let $node = this.getNodeFromEvent(e);

                    if ($node?.is('.selected')) {
                        $draggedNode = $node;

                        this.dragNodesStartedListener();
                    }
                }
            },
            onPointerUp: (state, e) => {
                if (e.button === 1) {
                    this.scrollComponent.props.friction = 1;

                } else if (e.button === 0) {
                    this.scrollComponent.props.friction = 1;
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

    setMap(map) {
        this.map = map;
        this.mapObservers.setSingleObservable(map);
        this.mapObservers.triggerFor(map);
    }

    setClickListener(listener) {
        this.clickListener = listener;
    }

    setRightClickListener(listener) {
        this.rightClickListener = listener;
    }

    setDoubleClickListener(listener) {
        this.doubleClickListener = listener;
    }

    setMouseMoveListener(listener) {
        this.mouseMoveListener = listener;
    }

    setDragNodesStartedListener(listener) {
        this.dragNodesStartedListener = listener;
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
        this.mapNodeObservers.attachTo(mapNode);
    }

    removeNode(mapNode) {
        this.findMapNodeElement(mapNode).remove();
        this.mapNodeObservers.detachFrom(mapNode);
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