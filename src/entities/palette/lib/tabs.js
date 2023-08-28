import {getPluralTagTitle, getTagIconComponent} from '../../../shared/lib';

const tabs = [
    createTab('terrain', 'terrain'),
    createTab('landmark', 'landmark'),
    createTab('structure', 'structure'),
    createTab('building', 'building'),
    createTab('unit', 'unit'),
    createTab('item', 'item'),
    createTab('magic', 'magic'),
    createTab('composed', 'composition'),
];

function createTab(configName, displayTag) {
    let title = getPluralTagTitle(displayTag);
    let icon = getTagIconComponent(displayTag);

    return {
        configName,
        title,
        icon,
    };
}

export default tabs;
