import {Editor, EditorContext} from '../../../shared/lib';

async function createEditor() {
    let SERVER_URL = 'http://localhost:4000';

    let context = new EditorContext(SERVER_URL);

    return new Editor(context);
}

let editorInstance = await createEditor();

export default editorInstance;
