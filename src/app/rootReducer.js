import {combineReducers} from '@reduxjs/toolkit';
import {layersSlice, pointerModeSlice, selectionSlice, workspaceSlice} from '../entities/editor';

export const rootReducer = combineReducers({
    [workspaceSlice.name]: workspaceSlice.reducer,
    [selectionSlice.name]: selectionSlice.reducer,
    [layersSlice.name]: layersSlice.reducer,
    [pointerModeSlice.name]: pointerModeSlice.reducer,
});
