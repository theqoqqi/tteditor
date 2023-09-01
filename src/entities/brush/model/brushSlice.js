import {createSelector, createSlice} from '@reduxjs/toolkit';
import castArray from 'lodash.castarray';
import uniq from 'lodash.uniq';
import {editorInstance} from '../../../shared/lib/index.js';

const initialState = {
    mapNodes: [],
    mapNodeOffsets: [],
};

export const brushSlice = createSlice({
    name: 'brush',
    initialState,
    reducers: {
        setBrushMapNodes(state, action) {
            let mapNodes = castArray(action.payload);

            state.mapNodes = uniq(mapNodes);
            state.mapNodeOffsets = state.mapNodes.map(mapNode => ({
                x: mapNode.x,
                y: mapNode.y,
            }));
        },
        clearBrushMapNodes(state) {
            state.mapNodes = [];
            state.mapNodeOffsets = [];
        },
        setBrushPosition(state, action) {
            state.mapNodes.forEach((mapNode, index) => {
                let offset = state.mapNodeOffsets[index];
                let x = (offset?.x ?? 0) + action.payload.x;
                let y = (offset?.y ?? 0) + action.payload.y;

                editorInstance.context.setMapNodePosition(mapNode, x, y);
            });
        }
    },
});

const selectSelf = state => state[brushSlice.name];

export const selectBrushMapNodes = createSelector(
    selectSelf,
    state => state.mapNodes
);

export const {
    setBrushMapNodes,
    clearBrushMapNodes,
    setBrushPosition,
} = brushSlice.actions;
