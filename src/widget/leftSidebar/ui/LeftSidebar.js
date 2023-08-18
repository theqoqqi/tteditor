import styles from './LeftSidebar.module.css';
import React, {useState} from 'react';
import {TabbedSidebar} from '../../../shared/ui';
import {BsArrow90DegLeft, BsFolderFill, BsGripVertical} from 'react-icons/bs';
import LevelListTab from './levelListTab/LevelListTab.js';

const allTabs = [
    {
        title: 'Список карт',
        icon: <BsFolderFill />,
        content: <LevelListTab />,
    },
    {
        title: 'Палитра',
        icon: <BsGripVertical />,
        content: <b>Палитра</b>,
    },
    {
        title: 'Изменения',
        icon: <BsArrow90DegLeft />,
        content: <b>Изменения</b>,
    },
];

function LeftSidebar() {
    let [selectedTab, setSelectedTab] = useState(0);

    return (
        <TabbedSidebar
            contentClassName={styles.leftSidebarContent}
            side='left'
            selectedTab={selectedTab}
            onSelect={setSelectedTab}
            tabs={allTabs}
        />
    );
}

export default LeftSidebar;