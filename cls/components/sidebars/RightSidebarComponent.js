import AbstractComponent from '../AbstractComponent.js';
import RightSidebarView from '../../views/sidebars/RightSidebarView.js';

export default class RightSidebarComponent extends AbstractComponent {

    constructor(editor) {
        super(editor, RightSidebarView);
    }

    openNodeListTab(callback) {
        return this.view.openNodeListTab(callback);
    }
}