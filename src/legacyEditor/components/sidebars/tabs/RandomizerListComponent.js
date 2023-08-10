import AbstractComponent from '../../AbstractComponent.js';
import SetRandomizerPropertyCommand from '../../../../editor/commands/map/SetRandomizerPropertyCommand.js';
import RandomizerOption from '../../../../editor/map/RandomizerOption.js';
import AddRandomizersCommand from '../../../../editor/commands/map/AddRandomizersCommand.js';
import RemoveRandomizersCommand from '../../../../editor/commands/map/RemoveRandomizersCommand.js';
import RandomizerListView from '../../../views/sidebars/tabs/RandomizerListView.js';

export default class RandomizerListComponent extends AbstractComponent {

    constructor(editor) {
        super(editor, RandomizerListView);
    }

    bindListeners() {
        this.view.setRandomizerChangedListener((randomizer, newCount) => {
            let command = new SetRandomizerPropertyCommand(randomizer, 'count', newCount);

            this.editor.executeCommand(command);
        });

        this.view.setAddRandomizerButtonListener((item, count) => {
            let randomizer = new RandomizerOption(item, count);
            let command = new AddRandomizersCommand([randomizer]);

            this.editor.executeCommand(command);
            this.view.clearAddRandomizerInputs();
        });

        this.view.setRemoveRandomizerButtonClickListener(randomizer => {
            let command = new RemoveRandomizersCommand([randomizer]);

            this.editor.executeCommand(command);
        });
    }

    setMap(map) {
        this.view.setMap(map);
    }
}