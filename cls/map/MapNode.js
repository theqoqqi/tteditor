
let nextEditorId = 1;

export default class MapNode {

    constructor(tag, x, y) {
        this.editorId = nextEditorId++;
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