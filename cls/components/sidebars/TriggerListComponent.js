import TriggerListView from '../../views/sidebars/TriggerListView.js';
import Trigger from '../../map/Trigger.js';
import AbstractComponent from '../AbstractComponent.js';

export default class TriggerListComponent extends AbstractComponent {

    constructor(editor) {
        super(editor, TriggerListView);
    }

    bindListeners() {
        this.view.setAddButtonListener(triggerTitle => {
            let trigger = new Trigger(triggerTitle);

            this.map.addTrigger(trigger);
            this.editor.setTriggerInEditor(trigger);
            this.view.addTrigger(trigger);
            this.view.setSelectedTrigger(trigger);
            this.view.scrollToTrigger(trigger);
            this.view.clearNewTriggerInputs();
            this.editor.setLevelDirty();
        });

        this.view.setSelectionChangedListener(trigger => {
            this.editor.setTriggerInEditor(trigger);
        });

        this.view.setTriggerRepeatingChangedListener((trigger, isRepeating) => {
            trigger.repeat = isRepeating;
            this.editor.setLevelDirty();
        });

        this.view.setTriggerActivityChangedListener((trigger, isEnabled) => {
            if (isEnabled) {
                trigger.removeAllStatementsOfType('never');
            } else {
                trigger.addStatement('<never/>');
            }
            this.editor.setLevelDirty();
        });

        this.view.setRemoveTriggerButtonClickListener(trigger => {
            this.map.removeTrigger(trigger);
            this.view.removeTrigger(trigger);
            this.editor.setTriggerInEditor(null);
            this.editor.setLevelDirty();
        });
    }

    clearTriggers() {
        this.view.clearTriggers();
    }

    addTrigger(trigger) {
        this.view.addTrigger(trigger);
    }
}