import ContextMenuComponent from '../ContextMenuComponent.js';
import MapNodeContextMenuView from '../../views/menus/MapNodeContextMenuView.js';

export default class MapNodeContextMenuComponent extends ContextMenuComponent {

    constructor(editor) {
        super(editor, MapNodeContextMenuView);

        this.addItem({
            name: 'log-node-xml',
            iconClass: 'bi-terminal-plus',
            title: 'Вывести XML в консоль',
            clickListener: () => {
                let selectedMapNodes = this.editor.getSelectedNodes();

                for (const mapNode of selectedMapNodes) {
                    this.editor.logMapNode(mapNode);
                }

                if (selectedMapNodes.length === 0) {
                    let hoveredMapNode = this.editor.getTopMapNodeUnderPosition(this.view.x, this.view.y);

                    this.editor.logMapNode(hoveredMapNode);
                }
            },
        });

        this.addItem({
            name: 'show-hovered-nodes',
            iconClass: 'bi-stack',
            title: 'Объекты под курсором...',
            clickListener: () => {
                this.editor.showHoveredMapNodesContextMenuForPosition(this.view.x, this.view.y);
            },
        });

        this.addItem({
            name: 'item-3',
            iconClass: 'bi-bricks',
            title: 'Пункт 3',
            clickListener: () => console.log('Действие 3'),
        });
    }
}