import styles from './App.module.css';
import LeftSidebar from './components/widget/leftSidebar/LeftSidebar.js';
import WorkArea from './components/widget/workArea/WorkArea.js';
import RightSidebar from './components/widget/rightSidebar/RightSidebar.js';

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
