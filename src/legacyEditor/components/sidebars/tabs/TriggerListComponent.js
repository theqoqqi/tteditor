import AbstractComponent from '../../AbstractComponent.js';
import Trigger from '../../../../editor/map/Trigger.js';
import AddTriggersCommand from '../../../../editor/commands/map/AddTriggersCommand.js';
import SetTriggerPropertyCommand from '../../../../editor/commands/map/SetTriggerPropertyCommand.js';
import SetTriggerEnabledCommand from '../../../../editor/commands/map/SetTriggerEnabledCommand.js';
import RemoveTriggersCommand from '../../../../editor/commands/map/RemoveTriggersCommand.js';
import TriggerListView from '../../../views/sidebars/tabs/TriggerListView.js';

export default class TriggerListComponent extends AbstractComponent {

    constructor(editor) {
        super(editor, TriggerListView);
    }

    bindListeners() {
        this.view.setAddButtonListener(triggerTitle => {
            let trigger = new Trigger(triggerTitle);
            let command = new AddTriggersCommand([trigger]);

            this.editor.executeCommand(command);
            this.editor.setTriggerInEditor(trigger);
            this.view.setSelectedTrigger(trigger);
            this.view.scrollToTrigger(trigger);
            this.view.clearNewTriggerInputs();
        });

        this.view.setSelectionChangedListener(trigger => {
            this.editor.setTriggerInEditor(trigger);
        });

        this.view.setTriggerRepeatingChangedListener((trigger, isRepeating) => {
            let command = new SetTriggerPropertyCommand(trigger, 'repeat', isRepeating);

            this.editor.executeCommand(command);
        });

        this.view.setTriggerActivityChangedListener((trigger, isEnabled) => {
            let command = new SetTriggerEnabledCommand(trigger, isEnabled);

            this.editor.executeCommand(command);
        });

        this.view.setRemoveTriggerButtonClickListener(trigger => {
            let command = new RemoveTriggersCommand([trigger]);

            this.editor.executeCommand(command);
            this.editor.setTriggerInEditor(null);
        });
    }

    setMap(map) {
        this.view.setMap(map);
    }

    clearTriggers() {
        this.view.clearTriggers();
    }

    addTrigger(trigger) {
        this.view.addTrigger(trigger);
    }
}