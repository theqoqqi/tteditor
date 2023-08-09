import AbstractComponent from '../../AbstractComponent.js';
import RandomizerOption from '../../../map/RandomizerOption.js';
import RandomizerListView from '../../../views/sidebars/tabs/RandomizerListView.js';
import AddRandomizersCommand from '../../../commands/map/AddRandomizersCommand.js';
import RemoveRandomizersCommand from '../../../commands/map/RemoveRandomizersCommand.js';
import SetRandomizerPropertyCommand from '../../../commands/map/SetRandomizerPropertyCommand.js';

export default class RandomizerListComponent extends AbstractComponent {

    constructor(editor) {
        super(editor, RandomizerListView);
    }

    bindListeners() {
        this.view.setRandomizerChangedListener((randomizer, newCount) => {
            let command = new SetRandomizerPropertyCommand(this.editor, randomizer, 'count', newCount);

            this.editor.executeCommand(command);
        });

        this.view.setAddRandomizerButtonListener((item, count) => {
            let randomizer = new RandomizerOption(item, count);
            let command = new AddRandomizersCommand(this.editor, [randomizer]);

            this.editor.executeCommand(command);
            this.view.clearAddRandomizerInputs();
        });

        this.view.setRemoveRandomizerButtonClickListener(randomizer => {
            let command = new RemoveRandomizersCommand(this.editor, [randomizer]);

            this.editor.executeCommand(command);
        });
    }

    setMap(map) {
        this.view.setMap(map);
    }
}