import Context from './context.js';
import editorInstance from './instance.js';

export default function EditorProvider({ children }) {
    return (
        <Context.Provider value={editorInstance}>
            {children}
        </Context.Provider>
    );
}
