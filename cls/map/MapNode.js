import Observable from '../util/Observable.js';

let nextEditorId = 1;

export default class MapNode extends Observable {

    radius = null;
    type = null;
    name = null;
    hint = null;
    owner = null;
    subId = null;
    group = null;

    constructor(tag, x, y, isFake = false) {
        super();

        this.editorId = nextEditorId++;
        this.isFake = isFake;
        this.tag = tag;
        this.x = x;
        this.y = y;
    }

    clone() {
        let mapNode = new MapNode(this.tag, this.x, this.y, this.isFake);

        mapNode.radius = this.radius;
        mapNode.type = this.type;
        mapNode.name = this.name;
        mapNode.hint = this.hint;
        mapNode.owner = this.owner;
        mapNode.subId = this.subId;
        mapNode.group = this.group;

        return mapNode;
    }
}