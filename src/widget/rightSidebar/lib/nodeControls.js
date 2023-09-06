import uniq from 'lodash.uniq';
import {getAllowedProperties} from '../../../shared/lib';

export const nodeControls = [
    {
        title: 'Класс',
        controlName: 'tag',
        property: {
            type: 'text',
            name: 'tag',
            readonly: true,
        },
    },
    {
        title: 'Тип',
        controlName: 'type',
        property: {
            type: 'text',
            name: 'type',
            readonly: true,
        },
    },
    {
        title: 'Имя',
        controlName: 'name',
        property: {
            type: 'text',
            name: 'name',
        },
    },
    {
        title: 'Sub ID (для гемов)',
        controlName: 'subId',
        property: {
            type: 'number',
            name: 'subId',
        },
    },
    {
        title: 'Группа',
        controlName: 'group',
        property: {
            type: 'text',
            name: 'group',
        },
    },
    {
        title: 'Позиция',
        controlName: 'position',
        properties: [
            {
                type: 'number',
                name: 'x',
            },
            {
                type: 'number',
                name: 'y',
            },
        ]
    },
    {
        title: 'Радиус',
        controlName: 'radius',
        property: {
            type: 'number',
            name: 'radius',
        },
    },
    {
        title: 'Владелец',
        controlName: 'owner',
        property: {
            type: 'select',
            name: 'owner',
            options: {
                '': 'По умолчанию',
                neutral: 'Нейтралы',
                player: 'Игрок',
                enemy: 'Враг',
                enemy0: 'Враг 0',
                enemy1: 'Враг 1',
            },
        },
    },
    {
        title: 'Подсказка',
        controlName: 'hint',
        property: {
            type: 'text',
            name: 'hint',
        },
    },
];

export function getVisibleControls(tags) {
    let visibleProperties = uniq(uniq(tags).flatMap(getAllowedProperties));

    return uniq(visibleProperties.map(getControlByPropertyName));
}

export function getControlByPropertyName(propertyName) {
    let isSameProperty = property => property?.name === propertyName;

    return nodeControls.find(control => {
        return isSameProperty(control.property)
            || (control.properties ?? []).some(isSameProperty);
    });
}
