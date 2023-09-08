export const mapControls = [
    {
        title: 'Размер',
        controlName: 'size',
        nullable: true,
        properties: [
            {
                type: 'number',
                name: 'width',
                debounce: 500,
            },
            {
                type: 'number',
                name: 'height',
                debounce: 500,
            },
        ]
    },
    {
        title: 'Старт',
        controlName: 'start',
        nullable: true,
        properties: [
            {
                type: 'number',
                name: 'startX',
            },
            {
                type: 'number',
                name: 'startY',
            },
        ]
    },
    {
        title: 'Позиция базы',
        controlName: 'playerBase',
        nullable: true,
        properties: [
            {
                type: 'number',
                name: 'playerBaseX',
            },
            {
                type: 'number',
                name: 'playerBaseY',
            },
        ]
    },
];
