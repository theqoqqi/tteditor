import styles from './LeftSidebar.module.css';
import React, {useState} from 'react';
import {BsArrow90DegLeft, BsFolderFill, BsGripVertical} from 'react-icons/bs';
import LevelListTab from './levelListTab/LevelListTab';
import {SidebarTab, Tabs} from '../../../shared/ui';
import PaletteTab from './paletteTab/PaletteTab';

const allTabs = [
    {
        key: 'levelList',
        tab: <SidebarTab side='left' title='Список карт' icon={<BsFolderFill />} />,
        content: <LevelListTab />,
    },
    {
        key: 'palette',
        tab: <SidebarTab side='left' title='Палитра' icon={<BsGripVertical />} />,
        content: <PaletteTab />,
    },
    {
        key: 'commandList',
        tab: <SidebarTab side='left' title='Изменения' icon={<BsArrow90DegLeft />} />,
        content: <b>Изменения</b>,
    },
];

function LeftSidebar() {
    let [selectedTab, setSelectedTab] = useState(0);

    return (
        <Tabs
            side='left'
            classes={{
                tabList: styles.tabList,
                tabContent: styles.tabContent,
            }}
            selectedTab={selectedTab}
            onSelect={setSelectedTab}
            tabs={allTabs}
        />
    );
}

export default LeftSidebar;