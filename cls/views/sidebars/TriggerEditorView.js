
export default class TriggerEditorView {

    constructor(context, uiNodeFactory) {
        this.context = context;
        this.uiNodeFactory = uiNodeFactory;

        this.$triggerTitleInput = $('#trigger-title-input');
        this.$triggerEditor = $('#trigger-editor');

        this.editor = CodeMirror.fromTextArea(this.$triggerEditor[0], {
            mode: 'application/xml',
            theme: 'material-darker',
            styleActiveLine: true,
            lineNumbers: true,
            lineWrapping: true,
        });
    }

    setTitleChangedListener(listener) {
        this.$triggerTitleInput.on('change', e => {
            let name = this.$triggerTitleInput.val();

            listener(name);
        });
    }

    setContentChangedListener(listener) {
        this.editor.on('change', (instance, changeEvent) => {
            let statements = this.editor.getValue().split('\n');

            listener(statements);
        });
        // this.$triggerEditor.on('change', e => {
        //     let statements = this.$triggerEditor.val().split('\n');
        //
        //     listener(statements);
        // });
    }

    fillFromTrigger(trigger) {
        let text = trigger.statements.join('\n');

        this.$triggerTitleInput.val(trigger.title);
        // this.$triggerEditor.val(text);
        this.editor.setValue(text);
    }

    clearInputs() {
        this.$triggerTitleInput.val('');
        // this.$triggerEditor.val('');
        this.editor.setValue('');
    }
}