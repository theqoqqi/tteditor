import {createSelector, createSlice} from '@reduxjs/toolkit';
import castArray from 'lodash.castarray';
import uniq from 'lodash.uniq';
import union from 'lodash.union';
import pull from 'lodash.pull';

const initialState = {
    selectedMapNodes: [],
};

export const selectionSlice = createSlice({
    name: 'selection',
    initialState,
    reducers: {
        setSelection(state, action) {
            let mapNodes = castArray(action.payload);

            state.selectedMapNodes = uniq(mapNodes);
        },
        clearSelection(state) {
            state.selectedMapNodes = [];
        },
        addToSelection(state, action) {
            state.selectedMapNodes = union(state.selectedMapNodes, [action.payload]);
        },
        removeFromSelection(state, action) {
            pull(state.selectedMapNodes, action.payload);
        },
    },
});

const selectSelf = state => state[selectionSlice.name];

export const selectSelectedMapNodes = createSelector(
    selectSelf,
    state => state.selectedMapNodes
);

export const {
    setSelection,
    clearSelection,
    addToSelection,
    removeFromSelection,
} = selectionSlice.actions;
