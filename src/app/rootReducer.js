import { combineReducers } from '@reduxjs/toolkit';
import {editorSlice} from '../entities/editor';

export const rootReducer = combineReducers({
    [editorSlice.name]: editorSlice.reducer,
});
