
export default class StatusBarView {

    constructor(context, uiNodeFactory) {
        this.context = context;
        this.uiNodeFactory = uiNodeFactory;

        this.$xPosition = $('#x-position');
        this.$yPosition = $('#y-position');

        this.$workspacePathSpan = $('#workspace-path-span');
        this.$workspacePathInput = $('#workspace-path-input');
        this.$editWorkspacePathButton = $('#edit-workspace-path-button');
        this.$saveWorkspacePathButton = $('#save-workspace-path-button');

        this.setEditWorkspaceModeActive(false);
    }

    setMousePosition(x, y) {
        this.$xPosition.text(x);
        this.$yPosition.text(y);
    }

    setEditWorkspacePathButtonListener(listener) {
        this.$editWorkspacePathButton.click(e => {
            listener();
        });
    }

    setSaveWorkspacePathButtonListener(listener) {
        this.$saveWorkspacePathButton.click(e => {
            listener();
        });
    }

    setWorkspacePath(workspacePath) {
        let spanText = workspacePath || 'не назначена';

        this.$workspacePathSpan.text(spanText);
        this.$workspacePathSpan.attr('title', spanText);
        this.$workspacePathInput.val(workspacePath);
    }

    getWorkspacePath() {
        return this.$workspacePathInput.val();
    }

    setEditWorkspaceModeActive(active) {
        if (active) {
            let inputWidth = this.$workspacePathSpan.width();

            this.$workspacePathInput.width(inputWidth);
        }

        this.$workspacePathSpan.toggle(!active);
        this.$editWorkspacePathButton.toggle(!active);

        this.$workspacePathInput.toggle(active);
        this.$saveWorkspacePathButton.toggle(active);
    }
}