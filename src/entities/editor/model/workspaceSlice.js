import {createSelector, createSlice} from '@reduxjs/toolkit';

const initialState = {
    currentPath: null,
    loadingPath: null,
    isLoading: false,
    error: null,
};

export const workspaceSlice = createSlice({
    name: 'workspace',
    initialState,
    reducers: {
        setWorkspacePath(state, action) {
            state.currentPath = action.payload;
        },
        startLoadingWorkspace(state, action) {
            state.isLoading = true;
            state.loadingPath = action.payload;
            state.error = null;
        },
        finishLoadingWorkspace(state, action) {
            if (action.payload?.error) {
                state.error = action.payload.error;
            } else {
                state.currentPath = state.loadingPath;
            }

            state.isLoading = false;
        }
    },
});

const selectSelf = state => state[workspaceSlice.name];

export const selectWorkspacePath = createSelector(
    selectSelf,
    state => state.currentPath
);

export const selectLoadingPath = createSelector(
    selectSelf,
    state => state.loadingPath
);

export const selectIsLoading = createSelector(
    selectSelf,
    state => state.isLoading
);

export const selectError = createSelector(
    selectSelf,
    state => state.error
);

export const {
    setWorkspacePath,
    startLoadingWorkspace,
    finishLoadingWorkspace,
} = workspaceSlice.actions;
