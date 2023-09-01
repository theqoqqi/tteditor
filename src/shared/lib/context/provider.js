import Context from './context';
import editorInstance from './instance';

export default function EditorProvider({ children }) {
    return (
        <Context.Provider value={editorInstance}>
            {children}
        </Context.Provider>
    );
}
