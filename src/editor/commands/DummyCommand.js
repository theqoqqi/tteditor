import AbstractCommand from './AbstractCommand.js';

export default class DummyCommand extends AbstractCommand {

    #title;

    #iconClass;

    constructor(title, iconClass) {
        super();

        this.#title = title;
        this.#iconClass = iconClass;
    }

    get canUndo() {
        return false;
    }

    get title() {
        return this.#title;
    }

    get iconClass() {
        return this.#iconClass;
    }
}