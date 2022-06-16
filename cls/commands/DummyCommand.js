import AbstractCommand from './AbstractCommand.js';

export default class DummyCommand extends AbstractCommand {

    #title;

    constructor(editor, title) {
        super(editor);

        this.#title = title;
    }

    get title() {
        return this.#title;
    }
}