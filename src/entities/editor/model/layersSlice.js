import {createSelector, createSlice} from '@reduxjs/toolkit';
import castArray from 'lodash.castarray';
import uniq from 'lodash.uniq';
import union from 'lodash.union';
import pull from 'lodash.pull';
import editorInstance from '../lib/instance.js';

const initialState = {
    visibleLayers: editorInstance.context.getLayerTagNames(),
};

export const layersSlice = createSlice({
    name: 'layers',
    initialState,
    reducers: {
        setVisibleLayers(state, action) {
            let layers = castArray(action.payload);

            state.visibleLayers = uniq(layers);
        },
        setLayerVisible(state, action) {
            if (action.payload.visible) {
                state.visibleLayers = union(state.visibleLayers, [action.payload.layer]);
            } else {
                pull(state.visibleLayers, action.payload.layer);
            }
        },
    },
});

const selectSelf = state => state[layersSlice.name];

export const selectVisibleLayers = createSelector(
    selectSelf,
    state => state.visibleLayers
);

export const selectIsLayerVisible = createSelector(
    [
        selectSelf,
        (state, layer) => layer,
    ],
    (state, layer) => state.visibleLayers.includes(layer)
);

export const {
    setVisibleLayers,
    setLayerVisible,
} = layersSlice.actions;
