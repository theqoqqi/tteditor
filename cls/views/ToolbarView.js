import MapEditor from '../MapEditor.js';

export default class ToolbarView {

    constructor(context) {
        this.context = context;
        this.uiNodeFactory = context.getUiNodeFactory();

        this.$resetLevelButton = $('#reset-level-button');
        this.$saveLevelButton = $('#save-level-button');
        this.$downloadLevelButton = $('#download-level-button');

        this.$pointerModeButtons = $('#pointer-mode-toolbar .toolbar-icon');
        this.$selectPointerModeButton = $('#select-pointer-mode-button');
        this.$brushPointerModeButton = $('#brush-pointer-mode-button');
        this.$scrollPointerModeButton = $('#scroll-pointer-mode-button');
    }

    setResetLevelButtonListener(listener) {
        this.$resetLevelButton.click(() => {
            listener();
        });
    }

    setSaveLevelButtonListener(listener) {
        this.$saveLevelButton.click(() => {
            listener();
        });
    }

    setDownloadLevelButtonListener(listener) {
        this.$downloadLevelButton.click(() => {
            listener();
        });
    }

    setSelectPointerModeButtonListener(listener) {
        this.$selectPointerModeButton.click(() => {
            listener();
        });
    }

    setBrushPointerModeButtonListener(listener) {
        this.$brushPointerModeButton.click(() => {
            listener();
        });
    }

    setScrollPointerModeButtonListener(listener) {
        this.$scrollPointerModeButton.click(() => {
            listener();
        });
    }

    setPointerMode(mode) {
        this.$pointerModeButtons.removeClass('active');

        if (mode) {
            this.#pointerModeButtons.get(mode).addClass('active');
        }
    }

    get #pointerModeButtons() {
        return new Map([
            [MapEditor.POINTER_MODE_SELECT, this.$selectPointerModeButton],
            [MapEditor.POINTER_MODE_BRUSH, this.$brushPointerModeButton],
            [MapEditor.POINTER_MODE_SCROLL, this.$scrollPointerModeButton],
        ]);
    }
}