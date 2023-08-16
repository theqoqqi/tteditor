import styles from './MainPage.module.css';
import {LeftSidebar} from '../../../widget/leftSidebar';
import {WorkArea} from '../../../widget/workArea';
import {RightSidebar} from '../../../widget/rightSidebar';
import {MainToolbar} from '../../../widget/mainToolbar';
import {StatusBar} from '../../../widget/statusBar';

export default function MainPage() {
    return (
        <div className={styles.mainPage}>
            <MainToolbar />
            <div className={styles.middleRow}>
                <LeftSidebar />
                <WorkArea />
                <RightSidebar />
            </div>
            <StatusBar />
        </div>
    );
}
