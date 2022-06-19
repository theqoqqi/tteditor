import ItemListView from '../../util/ItemListView.js';
import ItemButtonView from '../../util/ItemButtonView.js';
import CompositeObserver from '../../../util/CompositeObserver.js';

export default class TriggerListView {

    constructor(context) {
        this.context = context;
        this.uiNodeFactory = context.getUiNodeFactory();

        this.$newTriggerTitleInput = $('#new-trigger-title-input');
        this.$addNewTriggerButton = $('#add-new-trigger-button');

        this.$triggerList = $('#trigger-list');
        this.itemListView = new ItemListView(this.$triggerList);

        this.itemListView.setDataItemKey('trigger');
        this.itemListView.setDataIdKey('trigger-id');
        this.itemListView.setItemIdKey('editorId');
        this.itemListView.setListItemFactory(item => this.createListItem(item));
        this.itemListView.setSelectionMode(ItemListView.SELECTION_MODE_SINGLE);

        this.addButtonListener = () => {};
        this.triggerRepeatingChangedListener = () => {};
        this.triggerActivityChangedListener = () => {};
        this.triggerRemoveButtonClickListener = () => {};

        this.mapObservers = new CompositeObserver();

        this.mapObservers.addElementAddedObserver('triggers', (trigger, index) => {
            this.addTrigger(trigger, index);
        });

        this.mapObservers.addElementRemovedObserver('triggers', trigger => {
            this.removeTrigger(trigger);
        });

        this.triggerObservers = new CompositeObserver();

        this.triggerObservers.addPropertyObserver('title', (title, oldValue, trigger) => {
            this.getListItem(trigger).find('.trigger-title').text(title);
        });

        this.triggerObservers.addPropertyObserver('repeat', (repeat, oldValue, trigger) => {
            let $listItem = this.getListItem(trigger);
            let repeatButton = ItemButtonView.findIn($listItem, 'repeat');

            repeatButton.setToggleState(repeat);
        });

        this.triggerObservers.addPropertyObserver('statements', (statements, oldValue, trigger) => {
            let active = !trigger.hasStatementOfType('never');

            this.setTriggerActive(trigger, active);
        });

        this.triggerObservers.addListObserver('statements', (statements, oldValue, trigger) => {
            let active = !trigger.hasStatementOfType('never');

            this.setTriggerActive(trigger, active);
        });

        this.bindListeners();
    }

    bindListeners() {
        this.$addNewTriggerButton.click(e => {
            let title = this.$newTriggerTitleInput.val();

            this.addButtonListener(title);
        });
    }

    setMap(map) {
        this.map = map;
        this.mapObservers.setSingleObservable(map);
        this.mapObservers.triggerFor(map);
    }

    setTriggerActive(trigger, active) {
        let $listItem = this.getListItem(trigger);
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

    addTrigger(trigger, index) {
        this.itemListView.addItem(trigger, index);
        this.triggerObservers.attachTo(trigger);
    }

    removeTrigger(trigger) {
        this.itemListView.removeItem(trigger);
        this.triggerObservers.detachFrom(trigger);
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

    getListItem(trigger) {
        return this.itemListView.getListItem(trigger);
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