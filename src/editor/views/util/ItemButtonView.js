
export default class ItemButtonView {

    constructor($button, options) {
        this.$button = $button;

        this.id = options.id ?? null;
        this.$listItem = options.$listItem ?? null;
        this.item = options.item ?? null;
        this.isToggle = options.isToggle ?? false;
        this.enabledClass = options.enabledClass ?? 'enabled';
        this.enabledIconClass = options.enabledIconClass ?? null;
        this.disabledIconClass = options.disabledIconClass ?? null;
        this.clickListener = options.clickListener ?? (() => {});

        this.$button.data('view', this);
        this.$button.attr('role', 'button');
        this.bindListeners();
    }

    bindListeners() {
        this.$button.on('click', e => {
            if (this.isToggle) {
                let isEnabledNow = !this.$button.is(`.${this.enabledClass}`);

                this.setToggleState(isEnabledNow);

                this.clickListener(this.item, isEnabledNow);
            } else {
                this.clickListener(this.item);
            }
        });
    }

    setClickListener(listener) {
        this.clickListener = listener;
    }

    setToggleState(isEnabled) {
        this.$button.toggleClass(this.enabledClass, isEnabled);

        if (this.enabledIconClass) {
            this.$button.toggleClass(this.enabledIconClass, isEnabled);
        }

        if (this.disabledIconClass) {
            this.$button.toggleClass(this.disabledIconClass, !isEnabled);
        }
    }

    /**
     * @return ItemButtonView
     */
    static findIn($listItem, id) {
        return $listItem
            .find('[role=button]')
            .filter((index, button) => {
                let view = $(button).data('view');
                return view.id === id;
            })
            .first()
            .data('view');
    }
}