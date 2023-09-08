import {colorsUtils} from '../../../shared/lib';

export const mapOptionsControls = [
    {
        title: 'ID',
        controlName: 'id',
        nullable: true,
        property: {
            type: 'number',
            name: 'id',
        },
    },
    {
        title: 'Музыка',
        controlName: 'music',
        nullable: true,
        property: {
            type: 'text',
            name: 'music',
        },
    },
    {
        title: 'Coloring',
        controlName: 'coloring',
        nullable: true,
        property: {
            type: 'color',
            name: 'coloring',
            defaultValue: colorsUtils.hexColorToColor('#ffffffff'),
        },
    },
    {
        title: 'Цвет разведанного',
        controlName: 'fowClearColor',
        nullable: true,
        property: {
            type: 'color',
            name: 'fowClearColor',
            defaultValue: colorsUtils.hexColorToColor('#ffffffff'),
        },
    },
];
