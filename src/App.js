import styles from './App.module.css';
import {LeftSidebar} from './widget/leftSidebar';
import {WorkArea} from './widget/workArea';
import {RightSidebar} from './widget/rightSidebar';
import {EditorProvider} from './shared/editor';
import {appStore} from './app/appStore.js';
import {Provider as ReduxProvider} from 'react-redux';

function App() {
    return (
        <ReduxProvider store={appStore}>
            <EditorProvider>
                <div className={styles.app}>
                    <LeftSidebar />
                    <WorkArea className={styles.workArea} />
                    <RightSidebar />
                </div>
            </EditorProvider>
        </ReduxProvider>
    );
}

export default App;
