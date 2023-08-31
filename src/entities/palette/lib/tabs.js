import {getPluralTagTitle, getTagIconComponent} from '../../../shared/lib';

const tabs = [
    createTab('terrain', 'terrain'),
    createTab('landmark', 'landmark'),
    createTab('structure', 'structure'),
    createTab('building', 'building'),
    createTab('unit', 'unit'),
    createTab('item', 'item'),
    createTab('magic', 'magic', [
        { tag: 'waypoint' },
        { tag: 'area' },
        { tag: 'area', name: 'startup' },
    ]),
    createTab('composed', 'composition'),
];

function createTab(configName, displayTag, additionalItems) {
    let title = getPluralTagTitle(displayTag);
    let icon = getTagIconComponent(displayTag);

    return {
        id: configName,
        configName,
        title,
        icon,
        additionalItems,
    };
}

export default tabs;
