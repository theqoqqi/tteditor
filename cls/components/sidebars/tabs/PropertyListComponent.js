import AbstractComponent from '../../AbstractComponent.js';
import PropertyListView from '../../../views/sidebars/tabs/PropertyListView.js';
import SetMapNodesPropertyCommand from '../../../commands/map/SetMapNodesPropertyCommand.js';

export default class PropertyListComponent extends AbstractComponent {

    constructor(editor) {
        super(editor, PropertyListView);
    }

    bindListeners() {
        this.view.setPropertyChangedListener((propertyName, newValue) => {
            let selectedNodes = this.editor.getSelectedNodes();
            let command = new SetMapNodesPropertyCommand(this.editor, selectedNodes, propertyName, newValue);

            this.editor.executeCommand(command);
        });
    }

    setMapNodes(mapNodes) {
        this.view.setMapNodes(mapNodes);
    }
}