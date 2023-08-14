import {configureStore} from '@reduxjs/toolkit';
import {rootReducer} from './rootReducer.js';

function makeStore() {
    let store = configureStore({
        reducer: rootReducer,
    });

    if ('hot' in module) {
        module.hot.accept('./rootReducer', () => {
            store.replaceReducer(require('./rootReducer').rootReducer);
        })
    }

    return store;
}

export const appStore = makeStore();
