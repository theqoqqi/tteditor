import styles from './Palette.module.css';
import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Tabs} from '../../../shared/ui';
import tabs from '../lib/tabs.js';
import PaletteTab from './paletteTab/PaletteTab.js';
import PaletteTabContent from './paletteTabContent/PaletteTabContent.js';

Palette.propTypes = {
    selectedTab: PropTypes.number,
    onSelectTab: PropTypes.func,
    tabFiller: PropTypes.func,
};

function Palette({ selectedTab, onSelectTab, tabFiller }) {
    let [mappedTabs] = useState(() => tabs.map(tab => ({
        key: tab.configName,
        tab: <PaletteTab title={tab.title} icon={tab.icon} />,
        content: <PaletteTabContent children={tabFiller(tab)} />,
    })));

    return (
        <Tabs
            side='top'
            className={styles.palette}
            classes={{
                tabList: styles.tabList,
            }}
            selectedTab={selectedTab}
            onSelect={onSelectTab}
            tabs={mappedTabs}
        />
    );
}

export default Palette;