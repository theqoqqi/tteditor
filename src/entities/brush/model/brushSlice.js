import {createSelector, createSlice} from '@reduxjs/toolkit';
import castArray from 'lodash.castarray';
import uniq from 'lodash.uniq';
import {editorInstance} from '../../../shared/lib';

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
            let position = action.payload;

            if (state.mapNodes.some(mapNode => editorInstance.context.shouldMapNodeAlignToGrid(mapNode))) {
                position = editorInstance.context
                    .alignPositionToGrid(action.payload.x, action.payload.y);
            }

            state.mapNodes.forEach((mapNode, index) => {
                let offset = state.mapNodeOffsets[index];
                let x = (offset?.x ?? 0) + position.x;
                let y = (offset?.y ?? 0) + position.y;

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
