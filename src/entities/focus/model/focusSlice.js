import {createSelector, createSlice} from '@reduxjs/toolkit';

const initialState = {
    cameraFocusPosition: {
        x: 0,
        y: 0,
    },
    nodeListFocusAtId: {
        x: 0,
        y: 0,
    },
};

export const focusSlice = createSlice({
    name: 'focus',
    initialState,
    reducers: {
        focusCameraAtMapNode(state, action) {
            state.focusPosition = {
                x: action.payload.x,
                y: action.payload.y,
            };
        },
        focusNodeListAtMapNode(state, action) {
            state.nodeListFocusAtId = action.payload.editorId;
        },
    },
});

const selectSelf = state => state[focusSlice.name];

export const selectCameraFocusPosition = createSelector(
    selectSelf,
    state => state.focusPosition
);

export const selectNodeListFocusAtId = createSelector(
    selectSelf,
    state => state.nodeListFocusAtId
);

export const {
    focusCameraAtMapNode,
    focusNodeListAtMapNode,
} = focusSlice.actions;
