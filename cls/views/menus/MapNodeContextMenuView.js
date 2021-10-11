import ContextMenuView from '../util/ContextMenuView.js';

export default class MapNodeContextMenuView extends ContextMenuView {

    constructor() {
        super();

        this.addItem({
            name: 'item-1',
            iconClass: 'bi-water',
            title: 'Пункт 1',
            clickListener: () => console.log('Действие 1'),
        });

        this.addItem({
            name: 'item-2',
            iconClass: '',
            title: 'Пункт 2',
            clickListener: () => console.log('Действие 2'),
        });

        this.addItem({
            name: 'item-3',
            iconClass: 'bi-bricks',
            title: 'Пункт 3',
            clickListener: () => console.log('Действие 3'),
        });
    }
}