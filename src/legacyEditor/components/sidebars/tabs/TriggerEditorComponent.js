import AbstractComponent from '../../AbstractComponent.js';
import SetTriggerPropertyCommand from '../../../../editor/commands/map/SetTriggerPropertyCommand.js';
import TriggerEditorView from '../../../views/sidebars/tabs/TriggerEditorView.js';

export default class TriggerEditorComponent extends AbstractComponent {

    constructor(editor) {
        super(editor, TriggerEditorView);
    }

    bindListeners() {
        this.view.setTitleChangedListener((title, trigger) => {
            if (!trigger) {
                return;
            }

            this.#setTriggerProperty(trigger, 'title', title);
        });

        this.view.setContentChangedListener((statements, trigger) => {
            if (!trigger) {
                return;
            }

            this.#setTriggerProperty(trigger, 'statements', statements);
        });
    }

    setTrigger(trigger) {
        this.view.setTrigger(trigger);
    }

    #setTriggerProperty(trigger, propertyName, value) {
        let command = new SetTriggerPropertyCommand(trigger, propertyName, value);

        this.editor.executeCommand(command);
    }
}