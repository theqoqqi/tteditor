import AbstractComponent from '../AbstractComponent.js';
import MapNodeContextMenuView from '../../views/menus/MapNodeContextMenuView.js';

export default class MapNodeContextMenuComponent extends AbstractComponent {

    constructor(editor) {
        super(editor, MapNodeContextMenuView);
    }

    bindListeners() {

    }

    showAt(x, y) {
        this.view.showAt(x, y);
    }
}