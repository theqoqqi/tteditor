import AbstractComponent from '../../AbstractComponent.js';
import LayerListView from '../../../views/sidebars/tabs/LayerListView.js';

export default class LayerListComponent extends AbstractComponent {

    constructor(editor) {
        super(editor, LayerListView);
    }

    bindListeners() {
        this.view.setSelectionChangedListener(layerNames => {
            this.editor.setActiveLayers(layerNames);
        });
    }
}