import AbstractComponent from '../../AbstractComponent.js';
import SetMapNodesPropertyCommand from '../../../../editor/commands/map/SetMapNodesPropertyCommand.js';
import PropertyListView from '../../../views/sidebars/tabs/PropertyListView.js';

export default class PropertyListComponent extends AbstractComponent {

    constructor(editor) {
        super(editor, PropertyListView);
    }

    bindListeners() {
        this.view.setPropertyChangedListener((propertyName, newValue) => {
            let selectedNodes = this.editor.getSelectedNodes();
            let command = new SetMapNodesPropertyCommand(selectedNodes, propertyName, newValue);

            this.editor.executeCommand(command);
        });
    }

    setMapNodes(mapNodes) {
        this.view.setMapNodes(mapNodes);
    }
}