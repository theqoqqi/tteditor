import AbstractComponent from './AbstractComponent.js';

export default class ContextMenuComponent extends AbstractComponent {

    constructor(editor, viewClass) {
        super(editor, viewClass);
    }

    addItem(item) {
        this.view.addItem(item);
    }

    showAt(x, y, options) {
        this.view.showAt(x, y);
    }

    get isOpened() {
        return this.view.isOpened;
    }
}