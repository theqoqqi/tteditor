import SetPropertiesCommand from '../SetPropertiesCommand.js';

export default class SetTerrainCommand extends SetPropertiesCommand {

    constructor(levelAccess, map, terrain) {
        super(levelAccess, [map], {
            terrain,
        });
    }

    setPropertyValue(map, propertyName, value) {
        this.levelAccess.setTerrain(value);
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