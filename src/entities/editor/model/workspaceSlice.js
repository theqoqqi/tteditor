import {createSelector, createSlice} from '@reduxjs/toolkit';

const initialState = {
    currentPath: null,
};

export const workspaceSlice = createSlice({
    name: 'workspace',
    initialState,
    reducers: {
        setWorkspacePath(state, action) {
            state.currentPath = action.payload;
        },
    },
});

const selectSelf = state => state[workspaceSlice.name];

export const selectWorkspacePath = createSelector(
    selectSelf,
    state => state.currentPath
);

export const {
    setWorkspacePath,
} = workspaceSlice.actions;
