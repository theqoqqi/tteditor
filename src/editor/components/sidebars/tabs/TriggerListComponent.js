import TriggerListView from '../../../views/sidebars/tabs/TriggerListView.js';
import Trigger from '../../../map/Trigger.js';
import AbstractComponent from '../../AbstractComponent.js';
import AddTriggersCommand from '../../../commands/map/AddTriggersCommand.js';
import RemoveTriggersCommand from '../../../commands/map/RemoveTriggersCommand.js';
import SetTriggerPropertyCommand from '../../../commands/map/SetTriggerPropertyCommand.js';
import SetTriggerEnabledCommand from '../../../commands/map/SetTriggerEnabledCommand.js';

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