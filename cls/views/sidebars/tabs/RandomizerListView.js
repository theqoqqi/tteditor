import CompositeObserver from '../../../util/CompositeObserver.js';

export default class RandomizerListView {

    constructor(context) {
        this.context = context;
        this.uiNodeFactory = context.getUiNodeFactory();

        this.$randomizerList = $('#randomizer-list');
        this.$newRandomizerTypeInput = $('#new-randomizer-type-input');
        this.$newRandomizerCountInput = $('#new-randomizer-count-input');
        this.$addNewRandomizerButton = $('#add-new-randomizer-button');

        this.randomizerChangedListener = () => {};

        this.createMapObservers();
        this.createRandomizerObservers();

        this.bindListeners();
    }

    createMapObservers() {
        this.mapObservers = new CompositeObserver();

        this.mapObservers.addPropertyObserver('options.randomizers', randomizers => {
            this.clearRandomizers();
            for (const randomizer of randomizers) {
                this.addRandomizer(randomizer);
            }
        });

        this.mapObservers.addElementAddedObserver('options.randomizers', randomizer => {
            this.addRandomizer(randomizer);
        });

        this.mapObservers.addElementRemovedObserver('options.randomizers', randomizer => {
            this.removeRandomizer(randomizer);
        });
    }

    createRandomizerObservers() {
        this.randomizerObservers = new CompositeObserver();

        this.randomizerObservers.addPropertyObserver('item', (itemName, oldValue, randomizer) => {
            let $randomizer = this.getListItem(randomizer);
            let $itemName = $randomizer.find('.item-name');

            $itemName.text(itemName);
        });

        this.randomizerObservers.addPropertyObserver('count', (count, oldValue, randomizer) => {
            let $randomizer = this.getListItem(randomizer);
            let $countInput = $randomizer.find('input');

            $countInput.val(count);
        });
    }

    bindListeners() {
        this.$randomizerList.on('change', 'input', e => {
            let $input = $(e.currentTarget);
            let $listItem = $input.closest('.randomizer-list-item');
            let randomizer = $listItem.data('randomizer');
            let newValue = +$input.val();

            if (newValue < 0) {
                newValue = 0;
                $input.val(0);
            }

            this.randomizerChangedListener(randomizer, newValue);
        });
    }

    setMap(map) {
        this.map = map;
        this.mapObservers.setSingleObservable(map);
        this.mapObservers.triggerFor(map);
    }

    setRandomizerChangedListener(listener) {
        this.randomizerChangedListener = listener;
    }

    setAddRandomizerButtonListener(listener) {
        this.$addNewRandomizerButton.click(e => {
            let typeName = this.$newRandomizerTypeInput.val();
            let count = +this.$newRandomizerCountInput.val();

            count = Math.max(0, count);

            listener(typeName, count);
        });
    }

    setRemoveRandomizerButtonClickListener(listener) {
        this.$randomizerList.on('click', '.remove-randomizer-button', e => {
            let $button = $(e.currentTarget);
            let $listItem = $button.closest('.randomizer-list-item');
            let randomizer = $listItem.data('randomizer');

            listener(randomizer);
        });
    }

    addRandomizer(randomizer) {
        let $listItem = this.createListItem(randomizer);

        this.$randomizerList.append($listItem);
        this.randomizerObservers.attachTo(randomizer);
    }

    removeRandomizer(randomizer) {
        this.getListItem(randomizer).remove();
        this.randomizerObservers.detachFrom(randomizer);
    }

    clearRandomizers() {
        this.$randomizerList.empty();
    }

    clearAddRandomizerInputs() {
        this.$newRandomizerTypeInput.val(null);
        this.$newRandomizerCountInput.val(null);
    }

    getListItem(randomizer) {
        return this.$randomizerList.find('.randomizer-list-item')
            .filter((index, randomizerElement) => {
                return $(randomizerElement).data('randomizer').editorId === randomizer.editorId;
            })
            .first();
    }

    createListItem(randomizer) {
        let $listItem = $(`
            <div class='randomizer-list-item property'>
                <label class='item-name'>
                    ${randomizer.item}
                </label>
                <div>
                    <input type='number' class='property-input form-control'
                           value='${randomizer.count}' min='0' />
                    <i class='icon-button remove-randomizer-button bi-x-circle-fill'></i>
                </div>
            </div>
        `);

        $listItem.data('randomizer', randomizer);

        return $listItem;
    }
}