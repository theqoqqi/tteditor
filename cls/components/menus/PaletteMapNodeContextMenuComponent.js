import ContextMenuComponent from '../ContextMenuComponent.js';
import PaletteMapNodeContextMenuView from '../../views/menus/PaletteMapNodeContextMenuView.js';

export default class PaletteMapNodeContextMenuComponent extends ContextMenuComponent {

    constructor(editor) {
        super(editor, PaletteMapNodeContextMenuView);

        this.options = null;

        this.addItem({
            name: 'log-node-xml',
            iconClass: 'bi-terminal-plus',
            title: 'Вывести XML в консоль',
            clickListener: () => {
                this.editor.logNode(this.options.tagName, this.options.typeName);
            },
        });
    }

    showAt(x, y, options) {
        super.showAt(x, y, options);

        this.options = options;
    }
}