import ItemListView from '../../util/ItemListView.js';
import CompositeObserver from '../../../util/CompositeObserver.js';

export default class CommandListView {

    constructor(context) {
        this.context = context;
        this.uiNodeFactory = context.getUiNodeFactory();

        this.commandExecutor = null;

        this.$nodeList = $('#command-list');
        this.itemListView = new ItemListView(this.$nodeList);

        this.itemListView.setDataItemKey('command');
        this.itemListView.setDataIdKey('command-id');
        this.itemListView.setItemIdKey('editorId');
        this.itemListView.setListItemFactory(item => this.createListItem(item));
        this.itemListView.setSelectionMode(ItemListView.SELECTION_MODE_SINGLE);

        this.redoCommandListener = () => {};
        this.undoCommandListener = () => {};

        this.createCommandListObservers();
        this.bindListeners();
    }

    createCommandListObservers() {
        this.commandExecutorObservers = new CompositeObserver();

        this.commandExecutorObservers.addElementAddedObserver('commands', command => {
            this.addCommand(command);
        });

        this.commandExecutorObservers.addElementRemovedObserver('commands', command => {
            this.removeCommand(command);
        });

        this.commandExecutorObservers.addPropertyObserver(
            'executedCommands',
            (executedCommands, oldExecutedCommands, commandExecutor) => {
                let command = commandExecutor.getCommand(executedCommands - 1);

                this.setSelectedItem(command);
            }
        );
    }

    bindListeners() {

    }

    setSelectionChangedListener(listener) {
        this.itemListView.setSelectionChangedListener(listener);
    }

    setCommandExecutor(commandExecutor) {
        this.commandExecutor = commandExecutor;
        this.commandExecutorObservers.setSingleObservable(commandExecutor);
        this.commandExecutorObservers.triggerFor(commandExecutor);
    }

    addCommand(command) {
        this.itemListView.addItem(command);
    }

    removeCommand(command) {
        this.itemListView.removeItem(command);
    }

    clearCommands() {
        this.itemListView.clearItems();
    }

    setSelectedItem(command) {
        this.itemListView.setSelectedItem(command);
    }

    createListItem(command) {
        let title = this.getCommandTitle(command); // TODO: иконки еще придумать каждому типу команды
        let $listItem = $(`
            <div class='command-list-item'>
                <i class='command-icon bi-file-earmark-font'></i>
                <span class='command-title' title='${title}'>${title}</span>
            </div>
        `);

        $listItem.data('command', command);

        return $listItem;
    }

    getCommandTitle(command) {
        return command.title;
    }
}