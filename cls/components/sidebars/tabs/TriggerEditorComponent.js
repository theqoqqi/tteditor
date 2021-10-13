import TriggerEditorView from '../../../views/sidebars/tabs/TriggerEditorView.js';
import AbstractComponent from '../../AbstractComponent.js';

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
        });

        this.view.setContentChangedListener((statements, trigger) => {
            if (!trigger) {
                return;
            }

            trigger.statements = statements;
        });
    }

    setTrigger(trigger) {
        this.view.setTrigger(trigger);
    }
}