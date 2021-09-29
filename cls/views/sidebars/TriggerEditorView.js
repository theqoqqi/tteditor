
export default class TriggerEditorView {

    constructor(context) {
        this.context = context;
        this.uiNodeFactory = context.getUiNodeFactory();

        this.$triggerTitleInput = $('#trigger-title-input');

        // https://ace.c9.io/#nav=howto&api=ace
        // https://github.com/ajaxorg/ace/wiki/Configuring-Ace
        // https://github.com/ajaxorg/ace-builds

        this.editor = ace.edit('trigger-editor', {

            // editor options
            selectionStyle: 'line',
            highlightActiveLine: true,
            highlightSelectedWord: true,
            cursorStyle: 'ace',
            behavioursEnabled: true,
            copyWithEmptySelection: true,
            tabSize: 2,
            useSoftTabs: true,
            enableMultiselect: true,

            // renderer options
            highlightGutterLine: true,
            fontSize: 12,
            fontFamily: `'Consolas', monospace`,
            scrollPastEnd: 0.5,
            theme: 'ace/theme/monokai',

            // session options
            mode: 'ace/mode/xml',

            // extension options
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
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
    }

    fillFromTrigger(trigger) {
        let text = trigger.statements.join('\n');

        this.$triggerTitleInput.val(trigger.title);
        this.editor.setValue(text);
        this.editor.clearSelection();
    }

    clearInputs() {
        this.$triggerTitleInput.val('');
        this.editor.setValue('');
    }
}