import CompositeObserver from '../../../util/CompositeObserver.js';
import AbstractView from '../../AbstractView.js';
import {colorToHexColor, getColorBrightness, hexColorToColor} from '../../../util/utils.js';

export default class MapOptionsView extends AbstractView {

    constructor(editor) {
        super(editor);

        this.$mapOptions = $('#map-options');
        this.$controls = this.$mapOptions.find('.property');

        this.controlChangedListener = () => {};

        this.createMapObserver();

        this.bindListeners();
    }

    createMapObserver() {
        this.mapObservers = new CompositeObserver();

        this.$controls.each((index, nodeProperty) => {
            let $nodeProperty = $(nodeProperty);
            let $inputs = $nodeProperty.find('input');

            $inputs.each((index, input) => {
                let $input = $(input);
                this.addMapObserversForInput($input);
            });
        });
    }

    addMapObserversForInput($input) {
        let options = $input.data('options');

        if (options.source) {
            this.addInputPropertyObserver($input, options);

        } else if (options['checksProperties']) {
            this.addCheckboxPropertyObservers($input, options);
        }
    }

    addInputPropertyObserver($input, options) {
        let propertyName = $input.data('property');
        let path = MapOptionsView.getMapPropertyPath(this.map, options.source, propertyName);

        this.mapObservers.addPropertyObserver(path, propertyValue => {
            let type = $input.attr('type');
            let mode = options.mode;

            $input.val(MapOptionsView.stringifyValue(type, mode, propertyValue));

            this.updateInputColors($input);
        });
    }

    addCheckboxPropertyObservers($input, options) {
        let propertyNames = options['checksProperties'];

        for (const checkedName of propertyNames) {
            this.addCheckboxPropertyObserver($input, checkedName, options);
        }
    }

    addCheckboxPropertyObserver($input, checkedName, options) {
        let propertyNames = options['checksProperties'];
        let $checkedInput = this.getPropertyInput(checkedName);
        let checkedOptions = $checkedInput.data('options');
        let checkedPropertyName = checkedOptions.name;
        let path = MapOptionsView.getMapPropertyPath(this.map, checkedOptions.source, checkedPropertyName);

        this.mapObservers.addPropertyObserver(path, () => {
            let propertyExists = false;

            for (const checkedName of propertyNames) {
                let $checkedInput = this.getPropertyInput(checkedName);
                let checkedOptions = $checkedInput.data('options');
                let source = checkedOptions.source;
                let propertyName = checkedOptions.name;
                let exists = MapOptionsView.isMapPropertyExists(this.map, source, propertyName);

                propertyExists = propertyExists || exists;
            }

            $input.prop('checked', propertyExists);
            this.onCheckboxChanged($input);
        });
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

    setMap(map) {
        this.mapObservers.setSingleObservable(map);
        this.mapObservers.triggerFor(map);
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

        if (options.mode === 'color') {
            let brightness = getColorBrightness(value);
            let hexColor = colorToHexColor(value);

            $input.css('background-color', hexColor ?? 'white');
            $input.css('color', brightness && brightness < 128 ? 'white' : 'black');
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
            return hexColorToColor(value) ?? '';
        }

        return value;
    }

    static stringifyValue(type, mode, value) {

        if (type === 'text' && mode === 'color') {
            return colorToHexColor(value);
        }

        return value === null ? '' : '' + value;
    }

    static getMapPropertyPath(map, source, propertyName) {
        if (source === 'map') {
            return propertyName;
        }

        if (source === 'options') {
            return source + '.' + propertyName;
        }

        throw new Error(`Invalid source: '${source}'`);
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
            return map[propertyName] !== null;
        }

        if (source === 'options') {
            return map.options[propertyName] !== null;
        }

        throw new Error(`Invalid source: '${source}'`);
    }
}