import AbstractComponent from '../AbstractComponent.js';
import MapNodeContextMenuView from '../../views/menus/MapNodeContextMenuView.js';

export default class MapNodeContextMenuComponent extends AbstractComponent {

    constructor(editor) {
        super(editor, MapNodeContextMenuView);

        this.addItem({
            name: 'log-node-xml',
            iconClass: 'bi-terminal-plus',
            title: 'Вывести XML в консоль',
            clickListener: (item, e) => {
                let selectedMapNodes = this.editor.getSelectedNodes();

                for (const mapNode of selectedMapNodes) {
                    this.logMapNode(mapNode);
                }
            },
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

    logMapNode(mapNode) {
        let tagName = mapNode.tag;
        let typeName = mapNode.type;
        let node = this.context.getNodeByName(tagName, typeName);
        let nodeInfo = this.context.getNodeInfoByName(tagName, typeName);

        console.log(`Node #${mapNode.editorId} (${tagName}, ${typeName})`, node, nodeInfo);
    }

    addItem(item) {
        this.view.addItem(item);
    }

    bindListeners() {

    }

    showAt(x, y) {
        this.view.showAt(x, y);
    }
}