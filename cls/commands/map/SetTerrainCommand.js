import SetPropertiesCommand from '../SetPropertiesCommand.js';

export default class SetTerrainCommand extends SetPropertiesCommand {

    constructor(editor, map, terrain) {
        super(editor, [map], {
            terrain,
        });
    }

    setPropertyValue(map, propertyName, value) {
        this.editor.setTerrain(value);
    }

    getTargetId(map) {
        return map.editorId;
    }

    get title() {
        return `Изменена базовая текстура`;
    }

    get iconClass() {
        return 'bi-square-fill';
    }
}