import AbstractComponent from './AbstractComponent.js';
import ToolbarView from '../views/ToolbarView.js';
import MapEditor from '../MapEditor.js';

export default class ToolbarComponent extends AbstractComponent {

    constructor(editor) {
        super(editor, ToolbarView);
    }

    bindListeners() {
        this.view.setResetLevelButtonListener(() => {
            this.editor.showModal('confirm', {
                message: 'Сбросить все несохраненные изменения?',
                onConfirm: () => this.editor.resetCurrentLevel(),
            });
        });

        this.view.setSaveLevelButtonListener(() => {
            this.editor.saveCurrentLevel();
        });

        this.view.setDownloadLevelButtonListener(() => {
            this.editor.downloadCurrentLevel();
        });

        this.view.setSelectPointerModeButtonListener(() => {
            this.editor.setPointerMode(MapEditor.POINTER_MODE_SELECT);
        });

        this.view.setBrushPointerModeButtonListener(() => {
            this.editor.setPointerMode(MapEditor.POINTER_MODE_BRUSH);
        });

        this.view.setScrollPointerModeButtonListener(() => {
            this.editor.setPointerMode(MapEditor.POINTER_MODE_SCROLL);
        });
    }

    setPointerMode(mode) {
        this.view.setPointerMode(mode);
    }
}