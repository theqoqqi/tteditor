import {createSelector, createSlice} from '@reduxjs/toolkit';
import pull from 'lodash.pull';

const initialState = {
    hiddenMapNodes: [],
};

export const hiddenNodesSlice = createSlice({
    name: 'hiddenNodes',
    initialState,
    reducers: {
        toggleMapNodeVisibility(state, action) {
            if (state.hiddenMapNodes.includes(action.payload)) {
                pull(state.hiddenMapNodes, action.payload);
            } else {
                state.hiddenMapNodes.push(action.payload);
            }
        },
    },
});

const selectSelf = state => state[hiddenNodesSlice.name];

export const selectHiddenMapNodes = createSelector(
    selectSelf,
    state => state.hiddenMapNodes
);

export const {
    toggleMapNodeVisibility,
} = hiddenNodesSlice.actions;
