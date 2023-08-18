import {createSelector, createSlice} from '@reduxjs/toolkit';
import pointerModes from './pointerModes.js';

const initialState = {
    currentMode: pointerModes.select.name,
};

export const pointerModeSlice = createSlice({
    name: 'pointerMode',
    initialState,
    reducers: {
        setPointerMode(state, action) {
            state.currentMode = action.payload;
        },
    },
});

const selectSelf = state => state[pointerModeSlice.name];

export const selectPointerMode = createSelector(
    selectSelf,
    state => state.currentMode
);

export const {
    setPointerMode,
} = pointerModeSlice.actions;
