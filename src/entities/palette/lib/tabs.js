import {getPluralTagTitle, getTagIconComponent} from '../../../shared/lib';
import React from 'react';

const tabs = [
    createTab('terrain', ['terrain']),
    createTab('landmark', ['landmark']),
    createTab('structure', ['structure']),
    createTab('building', ['building']),
    createTab('unit', ['unit']),
    createTab('item', ['item']),
    createTab('magic', ['magic', 'ambient']),
    createTab('composed', ['composition']),
];

function createTab(configName, nodeTags) {
    let firstTag = nodeTags[0];
    let title = getPluralTagTitle(firstTag);
    let icon = getTagIconComponent(firstTag);

    return {
        configName,
        nodeTags,
        title,
        icon,
    };
}

export default tabs;
