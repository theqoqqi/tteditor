import { combineReducers } from '@reduxjs/toolkit';
import {selectionSlice} from '../entities/editor';

export const rootReducer = combineReducers({
    [selectionSlice.name]: selectionSlice.reducer,
});
