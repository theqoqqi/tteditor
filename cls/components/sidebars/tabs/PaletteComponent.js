import AbstractComponent from '../../AbstractComponent.js';
import PaletteView from '../../../views/sidebars/tabs/PaletteView.js';
import SetTerrainCommand from '../../../commands/map/SetTerrainCommand.js';

export default class PaletteComponent extends AbstractComponent {

    constructor(editor) {
        super(editor, PaletteView);
    }

    bindListeners() {
        this.view.setSelectionChangedListener((tagName, typeName, name) => {
            if (this.editor.hasLoadedLevel()) {
                if (tagName === 'terrain') {
                    let terrain = this.context.createTerrainByName(typeName);
                    let command = new SetTerrainCommand(this.editor, this.map, terrain);

                    this.editor.executeCommand(command);

                } else if (tagName === null) {
                    this.editor.clearBrush();

                } else {
                    this.editor.setBrush(tagName, typeName, name);
                }
            }
        });

        this.view.setTabOpenedListener(tagName => {
            if (this.editor.hasLoadedLevel()) {
                if (tagName === 'terrain') {
                    this.view.setSelectedType('terrain', this.map.terrain.name);
                }
            }
        });
    }

    setSelectedType(tagName, typeName) {
        this.view.setSelectedType(tagName, typeName);
    }

    clearSelectedType() {
        this.view.setSelectedItem(null);
    }
}