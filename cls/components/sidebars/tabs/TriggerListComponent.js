import TriggerListView from '../../../views/sidebars/tabs/TriggerListView.js';
import Trigger from '../../../map/Trigger.js';
import AbstractComponent from '../../AbstractComponent.js';

export default class TriggerListComponent extends AbstractComponent {

    constructor(editor) {
        super(editor, TriggerListView);
    }

    bindListeners() {
        this.view.setAddButtonListener(triggerTitle => {
            let trigger = new Trigger(triggerTitle);

            this.editor.addTrigger(trigger);
            this.editor.setTriggerInEditor(trigger);
            this.view.addTrigger(trigger);
            this.view.setSelectedTrigger(trigger);
            this.view.scrollToTrigger(trigger);
            this.view.clearNewTriggerInputs();
        });

        this.view.setSelectionChangedListener(trigger => {
            this.editor.setTriggerInEditor(trigger);
        });

        this.view.setTriggerRepeatingChangedListener((trigger, isRepeating) => {
            trigger.repeat = isRepeating;
        });

        this.view.setTriggerActivityChangedListener((trigger, isEnabled) => {
            if (isEnabled) {
                trigger.removeAllStatementsOfType('never');
            } else {
                trigger.addStatement('<never/>');
            }
        });

        this.view.setRemoveTriggerButtonClickListener(trigger => {
            this.editor.removeTrigger(trigger);
            this.editor.setTriggerInEditor(null);
            this.view.removeTrigger(trigger);
        });
    }

    clearTriggers() {
        this.view.clearTriggers();
    }

    addTrigger(trigger) {
        this.view.addTrigger(trigger);
    }
}