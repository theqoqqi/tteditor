import AbstractComponent from '../../AbstractComponent.js';
import MapOptionsView from '../../../views/sidebars/tabs/MapOptionsView.js';
import SetMapPropertiesCommand from '../../../commands/map/SetMapPropertiesCommand.js';

export default class MapOptionsComponent extends AbstractComponent {

    constructor(editor) {
        super(editor, MapOptionsView);
    }

    bindListeners() {
        this.view.setControlChangedListener(e => {
            if (e.isCheckbox) {
                let propertyNames = this.view.getPropertyNamesForControl(e.controlName);
                let properties = {};

                for (const propertyName of propertyNames) {
                    let value = null;

                    if (e.newValue) {
                        value = this.view.getPropertyValue(propertyName);
                    }

                    properties[propertyName] = value;
                }

                this.#setMapProperties(properties);

            } else {
                this.#setMapProperties({
                    [e.propertyName]: e.newValue,
                });
            }
        });
    }

    #setMapProperties(propertyValues) {
        let command = new SetMapPropertiesCommand(this.editor, this.map, propertyValues);

        this.editor.executeCommand(command);
    }

    getPropertySource(propertyName) {
        return this.view.getPropertySource(propertyName);
    }

    setMap(map) {
        this.view.setMap(map);
    }
}