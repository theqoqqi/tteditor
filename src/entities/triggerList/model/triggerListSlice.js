import {createSelector, createSlice} from '@reduxjs/toolkit';

const initialState = {
    selectedTrigger: null,
};

export const triggerListSlice = createSlice({
    name: 'triggerList',
    initialState,
    reducers: {
        setSelectedTrigger(state, action) {
            state.selectedTrigger = action.payload;
        },
    },
});

const selectSelf = state => state[triggerListSlice.name];

export const selectSelectedTrigger = createSelector(
    selectSelf,
    state => state.selectedTrigger
);

export const {
    setSelectedTrigger,
} = triggerListSlice.actions;
