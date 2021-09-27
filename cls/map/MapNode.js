
let nextEditorId = 1;

export default class MapNode {

    constructor(tag, x, y, isFake = false) {
        this.editorId = nextEditorId++;
        this.isFake = isFake;
        this.tag = tag;
        this.x = x;
        this.y = y;
        this.radius = null;
        this.type = null;
        this.name = null;
        this.hint = null;
        this.owner = null;
        this.subId = null;
        this.group = null;
    }
}