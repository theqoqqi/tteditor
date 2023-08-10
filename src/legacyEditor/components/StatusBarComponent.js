import AbstractComponent from './AbstractComponent.js';
import StatusBarView from '../views/StatusBarView.js';

export default class StatusBarComponent extends AbstractComponent {

    constructor(editor) {
        super(editor, StatusBarView);
    }

    bindListeners() {
        this.view.setEditWorkspacePathButtonListener(() => {
            this.view.setEditWorkspaceModeActive(true);
        });

        this.view.setSaveWorkspacePathButtonListener(async () => {
            let oldValue = this.context.getWorkspacePath();
            let newValue = this.view.getWorkspacePath();

            this.view.setEditWorkspaceModeActive(false);

            if (oldValue !== newValue) {
                this.context.setWorkspacePath(newValue);
                await this.context.reloadDataFromServer();
                this.view.setWorkspacePath(newValue);
                await this.editor.reloadDataFromServer();
            }
        });
    }

    setMousePosition(x, y) {
        this.view.setMousePosition(x, y);
    }

    setWorkspacePath(workspacePath) {
        this.view.setWorkspacePath(workspacePath);
    }
}