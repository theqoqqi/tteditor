import TriggerEditorView from '../../views/sidebars/TriggerEditorView.js';
import AbstractComponent from '../AbstractComponent.js';

export default class TriggerEditorComponent extends AbstractComponent {

    constructor(editor) {
        super(editor, TriggerEditorView);
    }

    bindListeners() {
        this.view.setTitleChangedListener((title, trigger) => {
            if (!trigger) {
                return;
            }

            trigger.title = title;
            this.editor.setLevelDirty();
        });

        this.view.setContentChangedListener((statements, trigger) => {
            if (!trigger) {
                return;
            }

            trigger.statements = statements;
            this.editor.setLevelDirty();
        });
    }

    setTrigger(trigger) {
        this.view.setTrigger(trigger);
    }
}