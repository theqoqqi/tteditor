import {createSelector, createSlice} from '@reduxjs/toolkit';

const initialState = {
    positionOnMap: {
        x: 0,
        y: 0,
    },
};

export const pointerPositionSlice = createSlice({
    name: 'pointerPosition',
    initialState,
    reducers: {
        setPointerPositionOnMap(state, action) {
            state.positionOnMap = action.payload;
        },
    },
});

const selectSelf = state => state[pointerPositionSlice.name];

export const selectPointerPositionOnMap = createSelector(
    selectSelf,
    state => state.positionOnMap
);

export const {
    setPointerPositionOnMap,
} = pointerPositionSlice.actions;
