
export default class PropertyListView {

    #multipleValuesSymbol = Symbol();

    constructor(context, uiNodeFactory) {
        this.context = context;
        this.uiNodeFactory = uiNodeFactory;

        this.$propertyList = $('#property-list');
        this.$nodeProperties = this.$propertyList.find('.property');

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

        this.bindListeners();
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

    fillFromMapNodes(mapNodes) {
        let enabledControls = this.getEnabledControlsForMapNodes(mapNodes);

        this.$nodeProperties.each((index, nodeProperty) => {
            let $nodeProperty = $(nodeProperty);
            let controlName = $nodeProperty.data('control-name');
            let $inputs = $nodeProperty.find('input');

            $nodeProperty.toggle(enabledControls.includes(controlName));

            $inputs.each((index, input) => {
                let $input = $(input);
                let propertyName = $input.data('property');
                let value = this.getPropertyValueForMapNodes(mapNodes, propertyName);

                if (value === this.#multipleValuesSymbol) {
                    $input.val(null);
                    $input.attr('placeholder', '<разные>');
                } else {
                    $input.val(value);
                    $input.removeAttr('placeholder');
                }
            });
        });
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