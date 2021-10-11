import AbstractComponent from '../AbstractComponent.js';
import RandomizerOption from '../../map/RandomizerOption.js';
import RandomizerListView from '../../views/sidebars/RandomizerListView.js';

export default class RandomizerListComponent extends AbstractComponent {

    constructor(editor) {
        super(editor, RandomizerListView);
    }

    bindListeners() {
        this.view.setRandomizerChangedListener((randomizer, newCount) => {
            randomizer.count = newCount;
            this.editor.setLevelDirty();
        });

        this.view.setAddRandomizerButtonListener((item, count) => {
            let randomizer = new RandomizerOption(item, count);

            this.map.options.addRandomizer(randomizer);
            this.view.clearAddRandomizerInputs();
            this.editor.setLevelDirty();
        });

        this.view.setRemoveRandomizerButtonClickListener(randomizer => {
            this.map.options.removeRandomizer(randomizer);
            this.editor.setLevelDirty();
        });
    }

    setMap(map) {
        this.view.setMap(map);
    }
}