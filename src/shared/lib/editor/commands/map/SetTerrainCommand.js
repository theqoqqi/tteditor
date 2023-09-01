import SetPropertiesCommand from '../SetPropertiesCommand';

export default class SetTerrainCommand extends SetPropertiesCommand {

    constructor(map, terrain) {
        super([map], {
            terrain,
        });
    }

    setPropertyValue(map, propertyName, value) {
        this.levelEditor.setTerrain(value);
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