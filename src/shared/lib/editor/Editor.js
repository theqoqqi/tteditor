import CommandExecutor from './util/CommandExecutor';
import CompositeObserver from './util/observables/CompositeObserver';
import LevelEditor from './LevelEditor';
import InitialCommand from './commands/InitialCommand';
import Observable from './util/observables/Observable';
import RenderContext from './RenderContext';

export default class Editor extends Observable {

    #loadedLevelPath;

    isLevelDirty;

    constructor(context) {
        super();

        this.context = context;
        this.renderContext = new RenderContext(context);
        this.commandExecutor = new CommandExecutor();
        this.levelEditor = new LevelEditor();

        this.#loadedLevelPath = null;

        this.createObservers();
    }

    createObservers() {
        let valueChangeObserver = (newValue, oldValue) => {
            if (newValue !== oldValue) {
                this.setLevelDirty();
            }
        };

        let listUpdateObserver = () => {
            this.setLevelDirty();
        };



        this.mapObservers = new CompositeObserver();

        this.mapObservers.addPropertyObserver('options', valueChangeObserver);
        this.mapObservers.addPropertyObserver('terrain', valueChangeObserver);
        this.mapObservers.addPropertyObserver('width', valueChangeObserver);
        this.mapObservers.addPropertyObserver('height', valueChangeObserver);
        this.mapObservers.addPropertyObserver('startX', valueChangeObserver);
        this.mapObservers.addPropertyObserver('startY', valueChangeObserver);
        this.mapObservers.addPropertyObserver('playerBaseX', valueChangeObserver);
        this.mapObservers.addPropertyObserver('playerBaseY', valueChangeObserver);
        this.mapObservers.addPropertyObserver('nodes', valueChangeObserver);
        this.mapObservers.addPropertyObserver('triggers', valueChangeObserver);
        this.mapObservers.addListObserver('nodes', listUpdateObserver);
        this.mapObservers.addListObserver('triggers', listUpdateObserver);

        this.mapObservers.addPropertyObserver('options.id', valueChangeObserver);
        this.mapObservers.addPropertyObserver('options.music', valueChangeObserver);
        this.mapObservers.addPropertyObserver('options.coloring', valueChangeObserver);
        this.mapObservers.addPropertyObserver('options.fowClearColor', valueChangeObserver);
        this.mapObservers.addPropertyObserver('options.randomizers', valueChangeObserver);
        this.mapObservers.addListObserver('options.randomizers', listUpdateObserver);



        this.mapNodeObservers = new CompositeObserver();

        this.mapNodeObservers.addPropertyObserver('x', valueChangeObserver);
        this.mapNodeObservers.addPropertyObserver('y', valueChangeObserver);
        this.mapNodeObservers.addPropertyObserver('radius', valueChangeObserver);
        this.mapNodeObservers.addPropertyObserver('name', valueChangeObserver);
        this.mapNodeObservers.addPropertyObserver('hint', valueChangeObserver);
        this.mapNodeObservers.addPropertyObserver('owner', valueChangeObserver);
        this.mapNodeObservers.addPropertyObserver('subId', valueChangeObserver);
        this.mapNodeObservers.addPropertyObserver('group', valueChangeObserver);



        this.randomizerObservers = new CompositeObserver();

        this.randomizerObservers.addPropertyObserver('item', valueChangeObserver);
        this.randomizerObservers.addPropertyObserver('count', valueChangeObserver);



        this.triggerObservers = new CompositeObserver();

        this.triggerObservers.addPropertyObserver('title', valueChangeObserver);
        this.triggerObservers.addPropertyObserver('repeat', valueChangeObserver);
        this.triggerObservers.addPropertyObserver('statements', valueChangeObserver);
        this.triggerObservers.addListObserver('statements', listUpdateObserver);



        let addAttachDetachObservers = (propertyName, propertyObserver, attachableObserver) => {
            propertyObserver.addPropertyObserver(propertyName, (items, oldItems) => {
                for (const item of oldItems ?? []) {
                    attachableObserver.detachFrom(item);
                }
                for (const item of items ?? []) {
                    attachableObserver.attachTo(item);
                }
            });

            propertyObserver.addElementAddedObserver(propertyName, item => {
                attachableObserver.attachTo(item);
            });

            propertyObserver.addElementRemovedObserver(propertyName, item => {
                attachableObserver.detachFrom(item);
            });
        };

        addAttachDetachObservers('nodes', this.mapObservers, this.mapNodeObservers);
        addAttachDetachObservers('triggers', this.mapObservers, this.triggerObservers);
        addAttachDetachObservers('options.randomizers', this.mapObservers, this.randomizerObservers);
    }

    async loadLevelList() {
        return this.context.loadLevelList();
    }

    async loadLevel(filename) {
        let map = await this.context.loadLevel(filename);

        this.#loadedLevelPath = filename;

        this.setMap(map);

        this.commandExecutor.clear();
        this.setLevelClear();
        this.executeCommand(new InitialCommand());

        return map;
    }

    async reloadCurrentLevel() {
        return await this.loadLevel(this.#loadedLevelPath);
    }

    async saveCurrentLevel() {
        let filename = this.#loadedLevelPath;
        let map = this.levelEditor.getMap();

        await this.context.saveLevel(filename, map);

        this.setLevelClear();
    }

    async installToGame() {
        return await this.context.installToGame();
    }

    async installTestProfile() {
        return await this.context.installTestProfile();
    }

    async runGame() {
        return await this.context.runGame();
    }

    get loadedLevelPath() {
        return this.#loadedLevelPath;
    }

    get loadedLevelFilename() {
        return this.#loadedLevelPath.split(/\//g).pop();
    }

    setMap(map) {
        if (this.getMap()) {
            this.mapObservers.detachFrom(this.getMap());
        }

        this.levelEditor.setMap(map);

        this.mapObservers.attachTo(map);
        this.mapObservers.triggerForAll();
    }

    setLevelDirty() {
        this.isLevelDirty = true;
    }

    setLevelClear() {
        this.isLevelDirty = false;
    }

    executeCommand(command) {
        command.setup(this);

        this.commandExecutor.execute(command);
    }

    undoCommand() {
        this.commandExecutor.undo();
    }

    redoCommand() {
        this.commandExecutor.redo();
    }

    getMap() {
        return this.levelEditor.getMap();
    }

    getLevelEditor() {
        return this.levelEditor;
    }
}