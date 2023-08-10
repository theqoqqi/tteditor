import styles from './TabbedSidebar.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import SidebarTab from './sidebarTab/SidebarTab.js';
import SidebarTabList from './sidebarTabList/SidebarTabList.js';
import SidebarTabContentList from './sidebarTabContentList/SidebarTabContentList.js';
import SidebarTabContent from './sidebarTabContent/SidebarTabContent.js';

TabbedSidebar.propTypes = {
    className: PropTypes.any,
    side: PropTypes.oneOf(['left', 'right']),
    tabs: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string,
        icon: PropTypes.any,
        content: PropTypes.any,
    })),
};

function TabbedSidebar({ contentClassName, side, tabs, selectedTab, onSelect }) {

    function onClickTab(index) {
        onSelect(index === selectedTab ? null : index);
    }

    return (
        <aside
            className={classNames(styles.tabbedSidebar, styles[side])}
        >
            <SidebarTabList className={classNames(styles.tabList, styles[side])}>
                {tabs.map(({ title, icon }, index) => (
                    <SidebarTab
                        key={title}
                        icon={icon}
                        title={title}
                        flipped={side === 'right'}
                        selected={selectedTab === index}
                        onSelect={() => onClickTab(index)}
                    />
                ))}
            </SidebarTabList>
            <SidebarTabContentList>
                {tabs.map(({ title, content }, index) => (
                    <SidebarTabContent
                        key={title}
                        className={contentClassName}
                        selected={selectedTab === index}
                        children={content}
                    />
                ))}
            </SidebarTabContentList>
        </aside>
    );
}

export default TabbedSidebar;