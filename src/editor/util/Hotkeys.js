
export default class Hotkeys {

    isNoModifiersPressed;
    isAnyModifierPressed;
    isNothingPressed;
    isAnythingPressed;
    pressedShortcut;
    pressedModifiers;

    constructor(e) {
        this.event = e;
        this.isNoModifiersPressed = Hotkeys.isNoModifiersPressed(this.event);
        this.isAnyModifierPressed = Hotkeys.isAnyModifierPressed(this.event);
        this.isNothingPressed = Hotkeys.isNothingPressed(this.event);
        this.isAnythingPressed = Hotkeys.isAnythingPressed(this.event);
        this.pressedShortcut = Hotkeys.getPressedShortcut(this.event);
        this.pressedModifiers = Hotkeys.getPressedModifiers(this.event);
    }

    matches(shortcut) {
        return Hotkeys.matches(shortcut, this.event);
    }

    static from(e) {
        return new Hotkeys(e);
    }

    static bindGlobal(shortcut, callback) {
        this.bindWithOptions(shortcut, {
            callback,
        });
    }

    static bind(shortcut, contextElement, callback) {
        this.bindWithOptions(shortcut, {
            element: contextElement,
            callback,
        });
    }

    static bindWithOptions(shortcut, options) {
        let element = options.element ?? window;
        let callback = options.callback ?? (() => {});
        let preventDefault = options.preventDefault ?? true;
        let stopPropagation = options.stopPropagation ?? true;

        element.addEventListener('keydown', e => {
            if (Hotkeys.matches(shortcut, e)) {
                if (preventDefault) {
                    e.preventDefault();
                }
                if (stopPropagation) {
                    e.stopPropagation();
                }
                callback();
            }
        });
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

    static matches(shortcut, event) {
        let pressedShortcut = this.getPressedShortcut(event);

        return this.isShortcutsEquals(pressedShortcut, shortcut);
    }

    static isShortcutsEquals(a, b) {
        let normA = this.normalizeShortcut(a.toLowerCase());
        let normB = this.normalizeShortcut(b.toLowerCase());

        return normA === normB;
    }

    static normalizeShortcut(shortcut) {
        let keys = shortcut.split('+');

        keys.sort();

        return keys.join('+');
    }

    static getPressedShortcut(event) {
        let modifiers = this.getPressedModifiers(event);
        let keys = modifiers ? [modifiers] : [];
        let keyName = this.getKeyName(event);

        if (keyName) {
            keys.push(keyName);
        }

        keys.sort();

        return keys.join('+');
    }

    static getKeyName(event) {
        return this.tryUnpackKeyName(event, /Key(\w)/g)
            ?? this.tryUnpackKeyName(event, /Digit(\d)/g)
            ?? this.tryUnpackKeyName(event, /Numpad(\d)/g)
            ?? event.key;
    }

    static tryUnpackKeyName(event, pattern) {
        let result = pattern.exec(event.code);

        if (!result) {
            return null;
        }

        return result[1];
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