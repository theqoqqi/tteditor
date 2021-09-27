
export default class RandomizerListView {

    constructor(context, uiNodeFactory) {
        this.context = context;
        this.uiNodeFactory = uiNodeFactory;

        this.$randomizerList = $('#randomizer-list');
        this.$newRandomizerTypeInput = $('#new-randomizer-type-input');
        this.$newRandomizerCountInput = $('#new-randomizer-count-input');
        this.$addNewRandomizerButton = $('#add-new-randomizer-button');

        this.randomizerChangedListener = () => {};

        this.bindListeners();
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

    fillFromMap(map) {
        this.clearRandomizers();
        for (const randomizer of map.options.randomizers) {
            this.addRandomizer(randomizer);
        }
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
    }

    removeRandomizer(randomizer) {
        this.getListItem(randomizer).remove();
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
                return $(randomizerElement).data('randomizer') === randomizer;
            })
            .first();
    }

    createListItem(randomizer) {
        let $listItem = $(`
            <div class='randomizer-list-item property'>
                <label>
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