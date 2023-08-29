
import {createContext} from 'react';
import editorInstance from './instance.js';

let Context = createContext(editorInstance);

export default Context;
