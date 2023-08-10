import styles from './RightSidebar.module.css';
import React, {useState} from 'react';
import {TabbedSidebar} from '../../../entities/tabbedSidebar';
import {BsBorderOuter, BsGridFill, BsPlayCircleFill} from 'react-icons/bs';

const allTabs = [
    {
        title: 'Элементы',
        icon: <BsGridFill />,
        content: <b>Элементы</b>,
    },
    {
        title: 'Триггеры',
        icon: <BsPlayCircleFill />,
        content: <b>Триггеры</b>,
    },
    {
        title: 'Карта',
        icon: <BsBorderOuter />,
        content: <b>Карта</b>,
    },
];

function RightSidebar({}) {
    let [selectedTab, setSelectedTab] = useState(0);

    return (
        <TabbedSidebar
            contentClassName={styles.rightSidebarContent}
            side='right'
            selectedTab={selectedTab}
            onSelect={setSelectedTab}
            tabs={allTabs}
        />
    );
}

export default RightSidebar;