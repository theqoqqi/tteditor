import React, {useState} from 'react';
import {Palette} from '../../../../entities/palette';

function PaletteTab() {
    let [selectedTab, setSelectedTab] = useState(0);

    return (
        <Palette
            selectedTab={selectedTab}
            onSelectTab={setSelectedTab}
        />
    );
}

export default PaletteTab;