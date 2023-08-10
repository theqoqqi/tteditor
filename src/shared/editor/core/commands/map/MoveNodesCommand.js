import MultiTargetCommand from '../MultiTargetCommand.js';

export default class MoveNodesCommand extends MultiTargetCommand {

    constructor(mapNodes, movedByX, movedByY) {
        super(mapNodes);

        this.movedByX = movedByX;
        this.movedByY = movedByY;
    }

    executeFor(mapNode) {
        this.levelEditor.setMapNodePosition(mapNode, mapNode.x + this.movedByX, mapNode.y + this.movedByY);
    }

    undoFor(mapNode) {
        this.levelEditor.setMapNodePosition(mapNode, mapNode.x - this.movedByX, mapNode.y - this.movedByY);
    }

    canBeMerged(other) {
        return this.isSameTypes(other) && this.isSameTargets(other);
    }

    merge(other) {
        this.movedByX += other.movedByX;
        this.movedByY += other.movedByY;
    }

    get title() {
        return `Перемещено ${this.targets.length} объектов`;
    }

    get iconClass() {
        return 'bi-arrows-move';
    }
}