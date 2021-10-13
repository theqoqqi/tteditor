import AbstractComponent from '../../AbstractComponent.js';
import PropertyListView from '../../../views/sidebars/tabs/PropertyListView.js';

export default class PropertyListComponent extends AbstractComponent {

    constructor(editor) {
        super(editor, PropertyListView);
    }

    bindListeners() {
        this.view.setPropertyChangedListener((propertyName, newValue) => {
            let selectedNodes = this.editor.getSelectedNodes();

            for (const mapNode of selectedNodes) {
                this.editor.setMapNodePropertyValue(mapNode, propertyName, newValue);
            }
        });
    }

    setMapNodes(mapNodes) {
        this.view.setMapNodes(mapNodes);
    }
}