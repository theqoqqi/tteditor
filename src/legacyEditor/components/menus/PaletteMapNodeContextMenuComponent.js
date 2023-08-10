import ContextMenuComponent from '../ContextMenuComponent.js';
import PaletteMapNodeContextMenuView from '../../views/menus/PaletteMapNodeContextMenuView.js';

export default class PaletteMapNodeContextMenuComponent extends ContextMenuComponent {

    constructor(editor) {
        super(editor, PaletteMapNodeContextMenuView);

        this.options = null;

        this.addItem({
            name: 'log-node-xml',
            iconClass: 'bi-terminal-plus',
            title: 'Вывести XML в консоль',
            clickListener: () => {
                this.editor.logNode(this.options.tagName, this.options.typeName);
            },
        });

        this.addItem({
            name: 'generate-grid',
            iconClass: 'bi-bricks',
            title: 'Сгенерировать сетку',
            visible: () => {
                return this.options.tagName === 'landmark'
                    && this.context.shouldAlignToGrid(this.options.tagName, this.options.typeName);
            },
            clickListener: () => {
                if (!this.editor.hasLoadedLevel()) {
                    return;
                }

                let tagName = this.options.tagName;
                let typeName = this.options.typeName;
                let name = this.options.name;

                this.generateGrid(tagName, typeName, name);
            },
        });
    }

    generateGrid(tagName, typeName, name) {
        let gridWidth = this.context.getAlignGridWidth();
        let gridHeight = this.context.getAlignGridHeight();
        let mapWidth = this.map.width + gridWidth / 2;
        let mapHeight = this.map.height + gridHeight / 2;

        for (let x = 0; x < mapWidth; x += gridWidth) {
            for (let y = 0; y < mapHeight; y += gridHeight) {
                let xIndex = Math.round(x / gridWidth);
                let yIndex = Math.round(y / gridHeight);
                let shouldPlace = (xIndex + yIndex) % 2 === 0;

                if (shouldPlace) {
                    let mapNode = this.context.createMapNode(x, y, tagName, typeName, name);

                    // TODO: Скорее всего, это не должно быть прямым вызовом функции.
                    //       Ведь в таком случае это действие не попадает в историю команд и его невозможно отменить.
                    this.levelEditor.addNode(mapNode);
                }
            }
        }
    }

    showAt(x, y, options) {
        super.showAt(x, y, options);

        this.options = options;
    }
}