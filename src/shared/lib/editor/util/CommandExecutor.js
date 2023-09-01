import Observable from './observables/Observable';

export default class CommandExecutor extends Observable {

    constructor() {
        super();

        this.commands = [];
        this.executedCommands = 0;
    }

    execute(command) {
        if (this.executedCommands < this.commands.length) {
            this.commands.splice(this.executedCommands);
        }

        command.execute();
        this.#pushCommand(command);
    }

    #pushCommand(command) {
        if (this.#canBeMerged(command)) {
            this.#lastExecutedCommand.merge(command);
        } else {
            this.commands.push(command);
            this.executedCommands++;
        }
    }

    #canBeMerged(command) {
        if (this.executedCommands === 0) {
            return;
        }

        let lastCommand = this.#lastExecutedCommand;

        return lastCommand.canBeMerged(command);
    }

    redo() {
        if (this.executedCommands === this.commands.length) {
            return;
        }

        this.commands[this.lastExecutedIndex + 1].execute();
        this.executedCommands++;
    }

    undo() {
        if (this.executedCommands === 0) {
            return;
        }

        let command = this.commands[this.lastExecutedIndex];

        if (!command.canUndo) {
            return;
        }

        command.undo();
        this.executedCommands--;
    }

    rewindTo(command) {
        let commandIndex = this.commands.indexOf(command);

        if (commandIndex > this.lastExecutedIndex) {
            this.#redoUntil(commandIndex);

        } else if (commandIndex < this.lastExecutedIndex) {
            this.#undoUntil(commandIndex);
        }
    }

    clear() {
        this.commands.splice(0);
        this.executedCommands = 0;
    }

    getCommand(index) {
        return this.commands[index] ?? null;
    }

    isExecuted(command) {
        let commandIndex = this.commands.indexOf(command);

        if (commandIndex < 0) {
            return false;
        }

        return commandIndex <= this.lastExecutedIndex;
    }

    #redoUntil(commandIndex) {
        let commandsToRedo = this.commands.slice(this.lastExecutedIndex + 1, commandIndex + 1);

        for (const command of commandsToRedo) {
            command.execute();
        }

        this.lastExecutedIndex = commandIndex;
    }

    #undoUntil(commandIndex) {
        let commandsToUndo = this.commands.slice(commandIndex + 1, this.lastExecutedIndex + 1).reverse();

        for (const command of commandsToUndo) {
            command.undo();
        }

        this.lastExecutedIndex = commandIndex;
    }

    set lastExecutedIndex(value) {
        this.executedCommands = value + 1;
    }

    get lastExecutedIndex() {
        return this.executedCommands - 1;
    }

    get #lastExecutedCommand() {
        if (this.lastExecutedIndex < 0) {
            return null;
        }

        return this.commands[this.lastExecutedIndex];
    }
}