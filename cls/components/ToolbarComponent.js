import AbstractComponent from './AbstractComponent.js';
import ToolbarView from '../views/ToolbarView.js';

export default class ToolbarComponent extends AbstractComponent {

    constructor(editor) {
        super(editor, ToolbarView);
    }

    bindListeners() {
        this.view.setResetLevelButtonListener(() => {
            this.editor.showModal('confirm', {
                message: 'Сбросить все несохраненные изменения?',
                onConfirm: () => this.resetCurrentLevel(),
            });
        });

        this.view.setSaveLevelButtonListener(() => {
            this.editor.saveCurrentLevel();
        });

        this.view.setDownloadLevelButtonListener(() => {
            this.editor.downloadCurrentLevel();
        });
    }
}