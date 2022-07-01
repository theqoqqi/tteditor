import CompositeObserver from '../../../util/CompositeObserver.js';
import AbstractView from '../../AbstractView.js';

export default class PropertyListView extends AbstractView {

    #multipleValuesSymbol = Symbol();

    constructor(editor) {
        super(editor);

        this.mapNodes = [];
        this.$propertyList = $('#property-list');
        this.$nodeProperties = this.$propertyList.find('.property');

        this.observedPropertyNames = [
            'x', 'y', 'radius', 'name', 'hint', 'owner', 'subId', 'group',
        ];

        this.allPropertyNames = [
            'tag', 'type', ...this.observedPropertyNames,
        ];

        this.enabledControlsByTagNames = {
            landmark:   [ 'tag', 'position', 'group', 'type', ],
            structure:  [ 'tag', 'position', 'group', 'type', 'hint', ],
            building:   [ 'tag', 'position', 'group', 'type', 'owner', 'hint', ],
            item:       [ 'tag', 'position', 'type', 'subId', ],
            chest:      [ 'tag', 'position', 'type', ],
            unit:       [ 'tag', 'position', 'group', 'type', 'owner', ],
            magic:      [ 'tag', 'position', 'type', 'owner', ],
            ambient:    [ 'tag', 'position', 'type', 'owner', ],
            waypoint:   [ 'tag', 'position', ],
            area:       [ 'tag', 'position', 'group', 'name', 'radius', 'owner', ],
        };

        this.mapNodeObservers = new CompositeObserver();

        for (const propertyName of this.observedPropertyNames) {
            this.addMapNodePropertyObserver(propertyName);
        }

        this.bindListeners();
    }

    addMapNodePropertyObserver(propertyName) {
        this.mapNodeObservers.addPropertyObserver(propertyName, () => {
            this.updateProperty(propertyName);
        });
    }

    bindListeners() {

    }

    setPropertyChangedListener(listener) {
        this.$propertyList.on('change', 'input', e => {
            let $input = $(e.target);
            let value = $input.val();
            let propertyName = $input.data('property');

            listener(propertyName, value);
        });
    }

    setMapNodes(mapNodes) {
        let enabledControls = this.getEnabledControlsForMapNodes(mapNodes);

        this.mapNodeObservers.detachFrom(...this.mapNodes);
        this.mapNodes = mapNodes;
        this.mapNodeObservers.attachTo(...mapNodes);

        this.setEnabledControls(enabledControls);
        this.updateAllProperties();
    }

    setEnabledControls(enabledControls) {
        this.$nodeProperties.each((index, nodeProperty) => {
            let $nodeProperty = $(nodeProperty);
            let controlName = $nodeProperty.data('control-name');

            $nodeProperty.toggle(enabledControls.includes(controlName));
        });
    }

    updateAllProperties() {
        for (const propertyName of this.allPropertyNames) {
            this.updateProperty(propertyName);
        }
    }

    updateProperty(propertyName) {
        let $input = this.$propertyList.find(`[data-property=${propertyName}]`);
        let value = this.getPropertyValueForMapNodes(this.mapNodes, propertyName);

        if (value === this.#multipleValuesSymbol) {
            $input.val(null);
            $input.attr('placeholder', '<разные>');
        } else {
            $input.val(value);
            $input.removeAttr('placeholder');
        }
    }

    getPropertyValueForMapNodes(mapNodes, propertyName) {
        let values = mapNodes.map(mapNode => mapNode[propertyName]);
        let uniqueValues = [...new Set(values)];

        if (uniqueValues.length > 1) {
            return this.#multipleValuesSymbol;
        }

        if (uniqueValues.length === 1) {
            return uniqueValues[0];
        }

        return null;
    }

    getEnabledControlsForMapNodes(mapNodes) {
        let enabledControls = {};

        for (const mapNode of mapNodes) {
            let controls = this.enabledControlsByTagNames[mapNode.tag];

            for (const controlName of controls) {
                enabledControls[controlName] = true;
            }
        }

        return Object.keys(enabledControls);
    }
}