import AbstractCommand from './AbstractCommand';

export default class InitialCommand extends AbstractCommand {

    get canUndo() {
        return false;
    }

    get title() {
        return 'Изначальное состояние';
    }

    get iconClass() {
        return 'bi-circle';
    }
}