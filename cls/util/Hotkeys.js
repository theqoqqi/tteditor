
export default class Hotkeys {

    constructor() {

    }

    static isNoModifiersPressed(e) {
        return this.getPressedModifiers(e) === '';
    }

    static isAnyModifierPressed(e) {
        return this.getPressedModifiers(e) !== '';
    }

    static isNothingPressed(e) {
        return this.getPressedShortcut(e) === '';
    }

    static isAnythingPressed(e) {
        return this.getPressedShortcut(e) !== '';
    }

    static isPressed(shortcut, event) {
        let pressedShortcut = this.getPressedShortcut(event);

        return this.isShortcutsEquals(pressedShortcut, shortcut);
    }

    static isShortcutsEquals(a, b) {
        let normA = this.normalizeShortcut(a).toLowerCase();
        let normB = this.normalizeShortcut(b).toLowerCase();

        return normA === normB;
    }

    static normalizeShortcut(shortcut) {
        let keys = shortcut.split('+');

        keys.sort();

        return keys.join('+');
    }

    static getPressedShortcut(event) {
        let modifiers = this.getPressedModifiers(event);
        let keys = [modifiers];

        if (event.key) {
            keys.push(event.key);
        }

        return keys.join('+');
    }

    static getPressedModifiers(event) {
        let keys = [];

        if (event.ctrlKey) {
            keys.push('Control');
        }

        if (event.altKey) {
            keys.push('Alt');
        }

        if (event.shiftKey) {
            keys.push('Shift');
        }

        return keys.join('+');
    }
}