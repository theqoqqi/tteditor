import AbstractComponent from './AbstractComponent.js';
import CommandListView from '../views/sidebars/tabs/CommandListView.js';

export default class CommandListComponent extends AbstractComponent {

    constructor(editor) {
        super(editor, CommandListView);

        this.commandExecutor = null;
    }

    bindListeners() {
        this.view.setSelectionChangedListener(command => {
            this.commandExecutor.rewindTo(command);
        });
    }

    clearCommands() {
        this.view.clearCommands();
    }

    setCommandExecutor(commandExecutor) {
        this.commandExecutor = commandExecutor;
        this.view.setCommandExecutor(commandExecutor);
    }
}