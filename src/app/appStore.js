import {configureStore} from '@reduxjs/toolkit';
import {rootReducer} from './rootReducer.js';
import {editorSlice} from '../entities/editor';

function makeStore() {
    let store = configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware({
            serializableCheck: {
                ignoredPaths: [editorSlice.name],
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
