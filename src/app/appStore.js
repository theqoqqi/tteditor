import {configureStore} from '@reduxjs/toolkit';
import {rootReducer} from './rootReducer.js';
import {selectionSlice} from '../entities/selection';
import {brushSlice} from '../entities/brush/index.js';

function makeStore() {
    let store = configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware({
            serializableCheck: {
                ignoredPaths: [
                    selectionSlice.name,
                    brushSlice.name,
                ],
                ignoreActions: true,
            },
        }),
    });

    if ('hot' in module) {
        module.hot.accept('./rootReducer', () => {
            store.replaceReducer(require('./rootReducer').rootReducer);
        })
    }

    return store;
}

export const appStore = makeStore();
