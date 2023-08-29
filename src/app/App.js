import styles from './App.module.css';
import {EditorProvider} from '../shared/lib';
import {appStore} from './appStore.js';
import {Provider as ReduxProvider} from 'react-redux';
import MainPage from '../pages/main';

function App() {
    return (
        <ReduxProvider store={appStore}>
            <EditorProvider>
                <div className={styles.app}>
                    <MainPage />
                </div>
            </EditorProvider>
        </ReduxProvider>
    );
}

export default App;
