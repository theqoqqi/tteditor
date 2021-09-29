
export default class MapOptionsView {

    constructor(context) {
        this.context = context;
        this.uiNodeFactory = context.getUiNodeFactory();

        this.$mapOptions = $('#map-options');
        this.$controls = this.$mapOptions.find('.property');

        this.controlChangedListener = () => {};

        this.bindListeners();
    }

    bindListeners() {
        this.$mapOptions.on('change', 'input', e => {
            let $input = $(e.target);
            let controlName = this.getControlNameForInput($input);
            let propertyName = $input.data('property');
            let newValue = this.getPropertyValue(propertyName);
            let options = $input.data('options');
            let isCheckbox = $input.attr('type') === 'checkbox';

            if (isCheckbox) {
                this.onCheckboxChanged($input);
            }

            this.updateInputColors($input);

            this.controlChangedListener({
                controlName,
                propertyName,
                newValue,
                isCheckbox,
                source: options.source,
            });
        });
    }

    setControlChangedListener(listener) {
        this.controlChangedListener = listener;
    }

    fillFromMap(map) {
        this.$controls.each((index, nodeProperty) => {
            let $nodeProperty = $(nodeProperty);
            let $inputs = $nodeProperty.find('input');

            $inputs.each((index, input) => {
                let $input = $(input);
                let propertyName = $input.data('property');
                let options = $input.data('options');
                
                if (options.source) {
                    let type = $input.attr('type');
                    let mode = options.mode;
                    let propertyValue = MapOptionsView.getMapProperty(map, options.source, propertyName);

                    $input.val(MapOptionsView.stringifyValue(type, mode, propertyValue));

                    this.updateInputColors($input);

                } else if (options['checksProperties']) {
                    let propertyNames = options['checksProperties'];
                    let propertyValue = false;

                    for (const checkedName of propertyNames) {
                        let $checkedInput = this.getPropertyInput(checkedName);
                        let checkedOptions = $checkedInput.data('options');
                        let source = checkedOptions.source;
                        let propertyExists = MapOptionsView.isMapPropertyExists(map, source, checkedName);

                        propertyValue = propertyValue || propertyExists;
                    }

                    $input.prop('checked', propertyValue);
                    this.onCheckboxChanged($input);
                }
            });
        });
    }

    onCheckboxChanged($checkbox) {
        let isActive = $checkbox.prop('checked');
        let $property = $checkbox.closest('.property');

        $property.find(`.property-input:not([type='checkbox'])`).each((index, input) => {
            let $input = $(input);

            $input.prop('readonly', !isActive);
            $input.prop('disabled', !isActive);
        });
    }

    updateInputColors($input) {
        let propertyName = $input.data('property');
        let value = this.getPropertyValue(propertyName);
        let options = $input.data('options');

        if (options.mode === 'color' && value) {
            let brightness = getColorBrightness(value);
            let hexColor = colorToHexColor(value);

            $input.css('background-color', hexColor);
            $input.css('color', brightness < 128 ? 'white' : 'black');
        }
    }

    getPropertyType(propertyName) {
        return this.getPropertyInput(propertyName).attr('type');
    }

    getPropertySource(propertyName) {
        return this.getPropertyInput(propertyName).data('options').source;
    }

    getPropertyValue(propertyName) {
        let $input = this.getPropertyInput(propertyName);

        return MapOptionsView.parseInputValue($input);
    }

    getPropertyInput(propertyName) {
        return this.$controls.find(`[data-property='${propertyName}']`);
    }

    getControl(controlName) {
        return this.$controls.filter(`[data-control-name='${controlName}']`);
    }

    getPropertyNamesForControl(controlName) {
        return this.getControl(controlName)
            .find('.property-input')
            .filter(`:not([type='checkbox'])`)
            .map((index, property) => {
                return $(property).data('property');
            })
            .get();
    }

    getControlNameForProperty(propertyName) {
        let $input = this.getPropertyInput(propertyName);

        return this.getControlNameForInput($input);
    }

    getControlNameForInput($input) {
        return $input.closest('.property').data('control-name');
    }

    static parseInputValue($input) {
        let options = $input.data('options');
        let mode = options.mode;
        let type = $input.attr('type');
        let value = $input.val();

        if (type === 'number') {
            return +value;
        }

        if (type === 'checkbox') {
            return $input.prop('checked');
        }

        if (type === 'text' && mode === 'color') {
            return hexColorToColor(value);
        }

        return value;
    }

    static stringifyValue(type, mode, value) {

        if (type === 'text' && mode === 'color') {
            return colorToHexColor(value);
        }

        return value === null ? '' : '' + value;
    }

    static getMapProperty(map, source, propertyName) {
        if (source === 'map') {
            return map[propertyName];
        }

        if (source === 'options') {
            return map.options[propertyName];
        }

        throw new Error(`Invalid source: '${source}'`);
    }

    static isMapPropertyExists(map, source, propertyName) {
        if (source === 'map') {
            return !!map[propertyName];
        }

        if (source === 'options') {
            return !!map.options[propertyName];
        }

        throw new Error(`Invalid source: '${source}'`);
    }
}