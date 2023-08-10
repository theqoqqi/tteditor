import AbstractComponent from '../../AbstractComponent.js';
import PaletteView from '../../../views/sidebars/tabs/PaletteView.js';
import SetTerrainCommand from '../../../commands/map/SetTerrainCommand.js';
import MapEditor from '../../../MapEditor.js';

export default class PaletteComponent extends AbstractComponent {

    constructor(editor) {
        super(editor, PaletteView);

        this.lastSelection = null;
    }

    bindListeners() {
        this.view.setSelectionChangedListener((mapNodes, tagName, typeName, name) => {
            if (this.editor.hasLoadedLevel()) {
                this.lastSelection = null;

                if (tagName === 'terrain') {
                    let terrain = this.context.createTerrainByName(typeName);
                    let command = new SetTerrainCommand(this.levelAccess, this.map, terrain);

                    this.editor.executeCommand(command);

                } else if (tagName === null) {
                    this.editor.clearBrush();

                } else {
                    this.editor.setPointerMode(MapEditor.POINTER_MODE_BRUSH);
                    this.editor.setBrush(mapNodes);
                    this.lastSelection = mapNodes;

                    if (tagName === 'ambient') {
                        this.context.playSoundFor(tagName, typeName);
                    }
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

        this.view.setRightClickListener((tagName, typeName, name, e) => {
            this.editor.showPaletteMapNodeContextMenuForPosition(e.clientX, e.clientY, {
                tagName, typeName, name
            })
        });
    }

    selectLastBrush() {
        if (!this.lastSelection) {
            return;
        }

        this.editor.setBrush(this.lastSelection);
    }

    setSelectedType(tagName, typeName) {
        this.view.setSelectedType(tagName, typeName);
    }

    clearSelectedType() {
        this.view.setSelectedItem(null);
    }
}