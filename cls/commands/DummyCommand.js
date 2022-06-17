import AbstractCommand from './AbstractCommand.js';

export default class DummyCommand extends AbstractCommand {

    #title;

    #iconClass;

    constructor(editor, title, iconClass) {
        super(editor);

        this.#title = title;
        this.#iconClass = iconClass;
    }

    get title() {
        return this.#title;
    }

    get iconClass() {
        return this.#iconClass;
    }
}