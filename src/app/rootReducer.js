import { combineReducers } from '@reduxjs/toolkit';
import {layersSlice, selectionSlice} from '../entities/editor';

export const rootReducer = combineReducers({
    [selectionSlice.name]: selectionSlice.reducer,
    [layersSlice.name]: layersSlice.reducer,
});
