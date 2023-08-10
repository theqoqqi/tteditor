import styles from './App.module.css';
import {LeftSidebar} from './widget/leftSidebar';
import {WorkArea} from './widget/workArea';
import {RightSidebar} from './widget/rightSidebar';
import {EditorProvider} from './shared/editor';

function App() {
    return (
        <EditorProvider>
            <div className={styles.app}>
                <LeftSidebar />
                <WorkArea className={styles.workArea} />
                <RightSidebar />
            </div>
        </EditorProvider>
    );
}

export default App;
