import AbstractView from '../../AbstractView.js';

export default class LayerListView extends AbstractView {

    constructor(editor) {
        super(editor);

        this.$layerList = $('#map-layer-list');

        this.selectionChangedListener = () => {
        };

        this.fillLayerList();
        this.bindListeners();
        this.setAllLayersActive();
    }

    fillLayerList() {
        let layerTagNames = this.context.getLayerTagNames();

        for (const tagName of layerTagNames) {
            let $listItem = this.createListItem(tagName);

            this.$layerList.append($listItem);
        }
    }

    bindListeners() {
        this.$layerList.on('click', '.toolbar-icon', e => {
            let $listItem = $(e.currentTarget);
            let layerName = $listItem.data('layer-name');
            let layerNames = this.getActiveLayers();

            let index = layerNames.indexOf(layerName);

            if (index === -1) {
                layerNames.push(layerName);
            } else {
                layerNames.splice(index, 1);
            }

            this.setActiveLayers(layerNames);
        });
    }

    setSelectionChangedListener(listener) {
        this.selectionChangedListener = listener;
    }

    setAllLayersActive() {
        this.$layerList.find('.toolbar-icon').addClass('active');
        this.selectionChangedListener(this.getActiveLayers());
    }

    setActiveLayers(layerNames) {
        this.$layerList.find('.toolbar-icon').each((index, listItem) => {
            let $listItem = $(listItem);
            let layerName = $listItem.data('layer-name');

            $listItem.toggleClass('active', layerNames.includes(layerName));
        });

        this.selectionChangedListener(layerNames);
    }

    getActiveLayers() {
        return this.$layerList.find('.toolbar-icon.active')
            .map((index, nodeElement) => {
                return $(nodeElement).data('layer-name');
            })
            .get();
    }

    createListItem(tagName) {
        let iconClass = this.uiNodeFactory.getIconClassForTagName(tagName);

        return $(`
            <div class='toolbar-icon toolbar-icon-switcher ${tagName}' data-layer-name='${tagName}'>
                <i class='${iconClass}'></i>
            </div>
        `);
    }
}