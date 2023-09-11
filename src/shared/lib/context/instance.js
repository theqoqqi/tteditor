import Editor from '../editor/Editor';
import EditorContext from '../editor/EditorContext';
import {SERVER_URL} from '../env';

async function createEditor() {
    let context = new EditorContext(SERVER_URL);

    return new Editor(context);
}

let editorInstance = await createEditor();

export default editorInstance;
