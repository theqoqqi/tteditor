import styles from './MainPage.module.css';
import {LeftSidebar} from '../../../widget/leftSidebar';
import {WorkArea} from '../../../widget/workArea';
import {RightSidebar} from '../../../widget/rightSidebar';

export default function MainPage() {
    return (
        <div className={styles.mainPage}>
            <LeftSidebar />
            <WorkArea className={styles.workArea} />
            <RightSidebar />
        </div>
    );
}
