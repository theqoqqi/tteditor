
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

        this.titleObserver = title => {
            this.$triggerTitleInput.val(title);
        };

        this.statementsObserver = statements => {
            let text = statements.join('\n');

            this.editor.setValue(text);
            this.editor.clearSelection();
        };
    }

    setTitleChangedListener(listener) {
        this.$triggerTitleInput.on('change', e => {
            let name = this.$triggerTitleInput.val();

            listener(name, this.trigger);
        });
    }

    setContentChangedListener(listener) {
        this.editor.getSession().on('change', (instance, changeEvent) => {
            let statements = this.editor.getValue().split('\n');

            listener(statements, this.trigger);
        });
    }

    setTrigger(trigger) {
        if (this.trigger) {
            this.removeObserversFromTrigger(this.trigger);
        }

        this.trigger = trigger;

        if (this.trigger) {
            this.addObserversToTrigger(this.trigger);
            this.fillFromTrigger();
        } else {
            this.clearInputs();
        }
    }

    fillFromTrigger() {
        this.titleObserver(this.trigger.title);
        this.statementsObserver(this.trigger.statements);
    }

    addObserversToTrigger(trigger) {
        trigger.observeProperty('title', this.titleObserver);
        trigger.observeArray('statements', this.statementsObserver);
    }

    removeObserversFromTrigger(trigger) {
        trigger.unobserveProperty('title', this.titleObserver);
        trigger.unobserveArray('statements', this.statementsObserver);
    }

    clearInputs() {
        this.$triggerTitleInput.val('');
        this.editor.setValue('');
    }
}