import {createAsyncThunk, createSelector, createSlice} from '@reduxjs/toolkit';
import {editorInstance} from '../../../shared/lib';

const editorContext = editorInstance.context;

const initialState = {
    currentPath: null,
    loadingPath: null,
    isLoading: false,
    error: null,
};

export const setWorkspacePath = createAsyncThunk(
    'workspace/setWorkspacePath',
    async (workspacePath, { rejectWithValue }) => {
        let response = await editorContext.setWorkspacePath(workspacePath);

        if (response.status !== 'OK') {
            return rejectWithValue({
                error: response,
            });
        }

        await editorContext.reloadDataFromServer();

        return workspacePath;
    }
);

export const workspaceSlice = createSlice({
    name: 'workspace',
    initialState,
    reducers: {},
    extraReducers: {
        [setWorkspacePath.pending]: (state, action) => {
            if (state.isLoading) {
                return;
            }

            state.isLoading = true;
            state.loadingPath = action.meta.arg;
            state.error = null;
        },
        [setWorkspacePath.fulfilled]: (state, action) => {
            state.currentPath = action.payload;
            state.isLoading = false;
        },
        [setWorkspacePath.rejected]: (state, action) => {
            state.error = {
                error: JSON.parse(action.error.message),
            };
            state.isLoading = false;
        },
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
