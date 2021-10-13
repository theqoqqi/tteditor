import AbstractComponent from '../../AbstractComponent.js';
import RandomizerOption from '../../../map/RandomizerOption.js';
import RandomizerListView from '../../../views/sidebars/tabs/RandomizerListView.js';

export default class RandomizerListComponent extends AbstractComponent {

    constructor(editor) {
        super(editor, RandomizerListView);
    }

    bindListeners() {
        this.view.setRandomizerChangedListener((randomizer, newCount) => {
            randomizer.count = newCount;
        });

        this.view.setAddRandomizerButtonListener((item, count) => {
            let randomizer = new RandomizerOption(item, count);

            this.editor.addRandomizer(randomizer);
            this.view.clearAddRandomizerInputs();
        });

        this.view.setRemoveRandomizerButtonClickListener(randomizer => {
            this.editor.removeRandomizer(randomizer);
        });
    }

    setMap(map) {
        this.view.setMap(map);
    }
}