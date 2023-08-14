import {createSelector, createSlice} from '@reduxjs/toolkit';

const initialState = {
    selectedMapNodes: [],
};

export const editorSlice = createSlice({
    name: 'editor',
    initialState,
    reducers: {
        setSelection(state, action) {
            let mapNodes = Array.isArray(action.payload)
                ? action.payload : [action.payload];

            state.selectedMapNodes.length = 0;
            state.selectedMapNodes.push(...mapNodes);
        },
        clearSelection(state) {
            state.selectedMapNodes.length = 0;
        },
        addToSelection(state, action) {
            state.selectedMapNodes.push(action.payload);
        },
        removeFromSelection(state, action) {
            let index = state.selectedMapNodes.indexOf(action.payload);

            if (index !== -1) {
                state.selectedMapNodes.splice(index, 1);
            }
        },
    },
});

const selectSelf = state => state.editor;

export const selectSelectedMapNodes = createSelector(
    selectSelf,
    state => state.selectedMapNodes
);

export const {
    setSelection,
    clearSelection,
    addToSelection,
    removeFromSelection,
} = editorSlice.actions;
