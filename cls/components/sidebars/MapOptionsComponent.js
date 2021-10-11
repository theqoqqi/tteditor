import AbstractComponent from '../AbstractComponent.js';
import MapOptionsView from '../../views/sidebars/MapOptionsView.js';

export default class MapOptionsComponent extends AbstractComponent {

    constructor(editor) {
        super(editor, MapOptionsView);
    }

    bindListeners() {
        this.view.setControlChangedListener(e => {
            if (e.isCheckbox) {
                let propertyNames = this.view.getPropertyNamesForControl(e.controlName);

                for (const propertyName of propertyNames) {
                    if (e.newValue) {
                        let value = this.view.getPropertyValue(propertyName);

                        this.editor.setMapPropertyValue(propertyName, value);
                        this.editor.setLevelDirty();
                    } else {
                        this.editor.setMapPropertyValue(propertyName, null);
                        this.editor.setLevelDirty();
                    }
                }

            } else {
                this.editor.setMapPropertyValue(e.propertyName, e.newValue);
                this.editor.setLevelDirty();
            }
        });
    }

    getPropertySource(propertyName) {
        return this.view.getPropertySource(propertyName);
    }

    setMap(map) {
        this.view.setMap(map);
    }
}