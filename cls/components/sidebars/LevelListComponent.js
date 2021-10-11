import AbstractComponent from '../AbstractComponent.js';
import LevelListView from '../../views/sidebars/LevelListView.js';

export default class LevelListComponent extends AbstractComponent {

    constructor(editor) {
        super(editor, LevelListView);
    }

    bindListeners() {
        this.view.addFileClickListener(filename => {
            if (this.currentLevelFilename === filename) {
                return;
            }

            if (this.editor.isLevelDirty()) {
                this.editor.showModal('alert', 'Сперва необходимо сохранить изменения');
                return;
            }

            this.editor.loadLevel(filename);
        });
    }

    setSelectedFile(filename) {
        this.view.setSelectedFile(filename);
    }

    setLevelList(levelList) {
        this.view.setLevelList(levelList);
    }

    isLevelDirty() {
        return this.view.isSelectedLevelDirty();
    }

    setLevelDirty() {
        this.view.setSelectedLevelDirty(true);
    }

    setLevelClear() {
        this.view.setSelectedLevelDirty(false);
    }

    getSelectedFile() {
        return this.view.getSelectedFile();
    }
}