import styles from './Tabs.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Tab from './tab/Tab';
import TabList from './tabList/TabList';
import TabContentList from './tabContentList/TabContentList';
import TabContent from './tabContent/TabContent';

Tabs.propTypes = {
    className: PropTypes.any,
    classes: PropTypes.shape({
        tabList: PropTypes.string,
        tab: PropTypes.string,
        tabContent: PropTypes.string,
    }),
    side: PropTypes.oneOf(['left', 'right', 'top', 'bottom']),
    tabs: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string,
        tab: PropTypes.any,
        content: PropTypes.any,
    })),
};

function Tabs({ className, classes, as = 'div', side = 'top', tabs = [], selectedTab = 0, onSelect }) {

    function onClickTab(index) {
        onSelect?.(index === selectedTab ? null : index);
    }

    let AsComponent = as;

    return (
        <AsComponent
            className={classNames(styles.tabs, className, styles[side])}
        >
            <TabList className={classNames(styles.tabList, classes?.tabList)}>
                {tabs.map(({ key, tab }, index) => (
                    <Tab
                        key={key}
                        className={classes?.tab}
                        selected={selectedTab === index}
                        onSelect={() => onClickTab(index)}
                        children={tab}
                    />
                ))}
            </TabList>
            <TabContentList>
                {tabs.map(({ key, content }, index) => (
                    <TabContent
                        key={key}
                        className={classes?.tabContent}
                        selected={selectedTab === index}
                        children={content}
                    />
                ))}
            </TabContentList>
        </AsComponent>
    );
}

export default Tabs;