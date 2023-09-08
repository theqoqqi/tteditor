import styles from './RightSidebar.module.css';
import React, {useState} from 'react';
import {BsBorderOuter, BsGridFill, BsPlayCircleFill} from 'react-icons/bs';
import {SidebarTab, Tabs} from '../../../shared/ui';
import NodeListTab from './nodeListTab/NodeListTab';
import MapOptionsTab from './mapOptionsTab/MapOptionsTab';

const allTabs = [
    {
        key: 'nodeList',
        tab: <SidebarTab side='right' title='Элементы' icon={<BsGridFill />} />,
        content: <NodeListTab />,
    },
    {
        key: 'triggerList',
        tab: <SidebarTab side='right' title='Триггеры' icon={<BsPlayCircleFill />} />,
        content: <b>Триггеры</b>,
    },
    {
        key: 'mapOptions',
        tab: <SidebarTab side='right' title='Карта' icon={<BsBorderOuter />} />,
        content: <MapOptionsTab />,
    },
];

function RightSidebar() {
    let [selectedTab, setSelectedTab] = useState(0);

    return (
        <Tabs
            side='right'
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

export default RightSidebar;