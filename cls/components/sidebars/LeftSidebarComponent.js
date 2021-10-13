import AbstractComponent from '../AbstractComponent.js';
import LeftSidebarView from '../../views/sidebars/LeftSidebarView.js';

export default class LeftSidebarComponent extends AbstractComponent {

    constructor(editor) {
        super(editor, LeftSidebarView);
    }
}