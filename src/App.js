import styles from './App.module.css';
import {LeftSidebar} from './widget/leftSidebar';
import {WorkArea} from './widget/workArea';
import {RightSidebar} from './widget/rightSidebar';

function App() {
    return (
        <div className={styles.app}>
            <LeftSidebar />
            <WorkArea className={styles.workArea} />
            <RightSidebar />
        </div>
    );
}

export default App;
