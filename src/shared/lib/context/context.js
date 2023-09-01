import {createContext} from 'react';
import editorInstance from './instance';

let Context = createContext(editorInstance);

export default Context;
