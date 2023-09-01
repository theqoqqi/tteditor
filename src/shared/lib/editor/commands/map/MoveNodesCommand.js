import MultiTargetCommand from '../MultiTargetCommand';

export default class MoveNodesCommand extends MultiTargetCommand {

    constructor(mapNodes, movedByX, movedByY) {
        super(mapNodes);

        this.movedByX = movedByX;
        this.movedByY = movedByY;
    }

    executeFor(mapNode) {
        this.moveMapNodeBy(mapNode, this.movedByX, this.movedByY);
    }

    undoFor(mapNode) {
        this.moveMapNodeBy(mapNode, -this.movedByX, -this.movedByY);
    }

    moveMapNodeBy(mapNode, byX, byY) {
        this.editor.context.setMapNodePosition(mapNode, mapNode.x + byX, mapNode.y + byY);
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
}