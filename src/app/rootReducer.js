import {combineReducers} from '@reduxjs/toolkit';
import {workspaceSlice} from '../entities/workspace';
import {selectionSlice} from '../entities/selection';
import {layersSlice} from '../entities/layers';
import {pointerModeSlice} from '../entities/pointerMode';
import {paletteSlice} from '../entities/palette';
import {brushSlice} from '../entities/brush';
import {focusSlice} from '../entities/focus';

export const rootReducer = combineReducers({
    [workspaceSlice.name]: workspaceSlice.reducer,
    [selectionSlice.name]: selectionSlice.reducer,
    [layersSlice.name]: layersSlice.reducer,
    [pointerModeSlice.name]: pointerModeSlice.reducer,
    [paletteSlice.name]: paletteSlice.reducer,
    [brushSlice.name]: brushSlice.reducer,
    [focusSlice.name]: focusSlice.reducer,
});
