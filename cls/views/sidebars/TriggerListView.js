import ItemListView from '../util/ItemListView.js';
import ItemButtonView from '../util/ItemButtonView.js';

export default class TriggerListView {

    constructor(context, uiNodeFactory) {
        this.context = context;
        this.uiNodeFactory = uiNodeFactory;

        this.$newTriggerTitleInput = $('#new-trigger-title-input');
        this.$addNewTriggerButton = $('#add-new-trigger-button');

        this.$triggerList = $('#trigger-list');
        this.itemListView = new ItemListView(this.$triggerList);

        this.itemListView.setDataItemKey('trigger');
        this.itemListView.setListItemFactory(item => this.createListItem(item));

        this.addButtonListener = () => {};
        this.triggerRepeatingChangedListener = () => {};
        this.triggerActivityChangedListener = () => {};
        this.triggerRemoveButtonClickListener = () => {};

        this.bindListeners();
    }

    bindListeners() {
        this.$addNewTriggerButton.click(e => {
            let title = this.$newTriggerTitleInput.val();

            this.addButtonListener(title);
        });
    }

    setTriggerActive(trigger, active) {
        let $listItem = this.itemListView.getListItem(trigger);
        let buttonView = ItemButtonView.findIn($listItem, 'toggle');

        buttonView.setToggleState(active);
    }

    setAddButtonListener(listener) {
        this.addButtonListener = listener;
    }

    setSelectionChangedListener(listener) {
        this.itemListView.setSelectionChangedListener(listener);
    }

    setTriggerRepeatingChangedListener(listener) {
        this.triggerRepeatingChangedListener = listener;
    }

    setTriggerActivityChangedListener(listener) {
        this.triggerActivityChangedListener = listener;
    }

    setRemoveTriggerButtonClickListener(listener) {
        this.triggerRemoveButtonClickListener = listener;
    }

    setSelectedTrigger(trigger) {
        this.itemListView.setSelectedItem(trigger);
    }

    getSelectedTrigger() {
        return this.itemListView.getSelectedItem();
    }

    addTrigger(trigger) {
        this.itemListView.addItem(trigger);
    }

    removeTrigger(trigger) {
        this.itemListView.removeItem(trigger);
    }

    clearTriggers() {
        this.itemListView.clearItems();
    }

    clearNewTriggerInputs() {
        this.$newTriggerTitleInput.val(null);
    }

    scrollToTrigger(trigger) {
        this.itemListView.scrollToItem(trigger);
    }

    createListItem(trigger) {
        let title = trigger.title ?? '';

        let $listItem = $(`
            <div class='trigger-list-item'>
                <i class='trigger-icon bi-file-earmark-font'></i>
                <span class='trigger-title' title='${title}'>${title}</span>
                <i class='trigger-button repeat-trigger-button bi-arrow-repeat repeating'></i>
                <i class='trigger-button toggle-trigger-button bi-play-circle-fill enabled'></i>
                <i class='trigger-button remove-trigger-button bi-x-circle-fill'></i>
            </div>
        `);

        $listItem.data('trigger', trigger);

        let $repeatButton = $listItem.find('.repeat-trigger-button');
        let $toggleButton = $listItem.find('.toggle-trigger-button');
        let $removeButton = $listItem.find('.remove-trigger-button');

        let repeatButton = new ItemButtonView($repeatButton, {
            id: 'repeat',
            $listItem: $listItem,
            item: trigger,
            isToggle: true,
            enabledClass: 'repeating',
            enabledIconClass: 'bi-arrow-repeat',
            disabledIconClass: 'bi-arrow-right',
        });

        let toggleButton = new ItemButtonView($toggleButton, {
            id: 'toggle',
            $listItem: $listItem,
            item: trigger,
            isToggle: true,
            enabledClass: 'enabled',
            enabledIconClass: 'bi-play-circle-fill',
            disabledIconClass: 'bi-stop-circle-fill',
        });

        let removeButton = new ItemButtonView($removeButton, {
            id: 'remove',
            $listItem: $listItem,
            item: trigger,
        });

        repeatButton.setClickListener((item, enabled) => {
            this.triggerRepeatingChangedListener(item, enabled);
        });

        toggleButton.setClickListener((item, enabled) => {
            this.triggerActivityChangedListener(item, enabled);
        });

        removeButton.setClickListener((item) => {
            this.triggerRemoveButtonClickListener(item);
        });

        repeatButton.setToggleState(trigger.repeat);
        toggleButton.setToggleState(!trigger.hasStatementOfType('never'));

        return $listItem;
    }
}