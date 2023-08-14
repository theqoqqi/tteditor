import { combineReducers } from '@reduxjs/toolkit';
import {editorSlice} from '../shared/editor';

export const rootReducer = combineReducers({
    [editorSlice.name]: editorSlice.reducer,
});
