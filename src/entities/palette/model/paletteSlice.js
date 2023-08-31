import {createSelector, createSlice} from '@reduxjs/toolkit';

const initialState = {
    selectedItemsInTabs: {},
};

export const paletteSlice = createSlice({
    name: 'palette',
    initialState,
    reducers: {
        setSelectedPaletteItem(state, action) {
            state.selectedItemsInTabs[action.payload.tabId] = action.payload.itemId;
        },
    },
});

const selectSelf = state => state[paletteSlice.name];

export const selectIsPaletteItemSelected = createSelector(
    [
        selectSelf,
        (state, tabId) => tabId,
        (state, tabId, itemId) => itemId,
    ],
    (state, tabId, itemId) => state.selectedItemsInTabs[tabId] === itemId
);

export const {
    setSelectedPaletteItem,
} = paletteSlice.actions;
