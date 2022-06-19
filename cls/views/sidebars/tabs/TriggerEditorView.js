import CompositeObserver from '../../../util/CompositeObserver.js';

export default class TriggerEditorView {

    constructor(context) {
        this.context = context;
        this.uiNodeFactory = context.getUiNodeFactory();

        this.$triggerTitleInput = $('#trigger-title-input');

        this.trigger = null;

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

        this.shouldTriggerStatementsListener = true;

        this.triggerObservers = new CompositeObserver();

        this.triggerObservers.addPropertyObserver('title', title => {
            this.$triggerTitleInput.val(title);
        });

        this.triggerObservers.addPropertyObserver('statements', statements => {
            this.setStatements(statements);
        });

        this.triggerObservers.addListObserver('statements', statements => {
            this.setStatements(statements);
        });
    }

    setTitleChangedListener(listener) {
        this.$triggerTitleInput.on('change', e => {
            let name = this.$triggerTitleInput.val();

            listener(name, this.trigger);
        });
    }

    setContentChangedListener(listener) {
        this.editor.getSession().on('change', (instance, changeEvent) => {
            if (!this.trigger) {
                return;
            }

            let editorValue = this.editor.getValue();
            let triggerValue = this.trigger.statements.join('\n');
            let statements = editorValue.split('\n');

            if (this.shouldTriggerStatementsListener && editorValue !== triggerValue) {
                listener(statements, this.trigger);
            }
        });
    }

    setTrigger(trigger) {
        this.trigger = trigger;
        this.triggerObservers.setSingleObservable(trigger);
        this.triggerObservers.triggerFor(trigger);
    }

    setStatements(statements) {
        let text = (statements ?? []).join('\n');
        let editorValue = this.editor.getValue();

        if (text === editorValue) {
            return;
        }

        this.shouldTriggerStatementsListener = false;
        this.editor.setValue(text);
        this.shouldTriggerStatementsListener = true;
        this.editor.clearSelection();
    }
}