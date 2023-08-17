import styles from './MainPage.module.css';
import {LeftSidebar} from '../../../widget/leftSidebar';
import {WorkArea} from '../../../widget/workArea';
import {RightSidebar} from '../../../widget/rightSidebar';
import {MainToolbar} from '../../../widget/mainToolbar';
import {StatusBar} from '../../../widget/statusBar';
import {EditorContainer} from '../../../widget/editorContainer';

export default function MainPage() {
    return (
        <EditorContainer
            className={styles.mainPage}
            top={<MainToolbar />}
            left={<LeftSidebar />}
            center={<WorkArea />}
            right={<RightSidebar />}
            bottom={<StatusBar />}
        />
    );
}
