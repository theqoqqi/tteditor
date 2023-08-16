import styles from './MainPage.module.css';
import {LeftSidebar} from '../../../widget/leftSidebar';
import {WorkArea} from '../../../widget/workArea';
import {RightSidebar} from '../../../widget/rightSidebar';
import {Toolbar} from '../../../widget/toolbar';
import {StatusBar} from '../../../widget/statusBar';

export default function MainPage() {
    return (
        <div className={styles.mainPage}>
            <Toolbar />
            <div className={styles.middleRow}>
                <LeftSidebar />
                <WorkArea />
                <RightSidebar />
            </div>
            <StatusBar />
        </div>
    );
}
