import React, {useState} from 'react';
import {Palette} from '../../../../entities/palette';
import {useEditorContext, useWorkspace} from '../../../../entities/editor';
import {PaletteItem} from '../../../../features/palette';

function PaletteTab() {
    let editorContext = useEditorContext();
    let { workspacePath } = useWorkspace();
    let [selectedTab, setSelectedTab] = useState(0);

    if (!workspacePath) {
        return null;
    }

    function fillTab(configName) {
        let config = editorContext.getConfigByName(configName);
        let configItems = config.querySelectorAll(':scope > *');

        let paletteItems = Array.from(configItems).filter(item => {
            let typeName = item.getAttribute('name');
            let paletteItemNames = editorContext.getPaletteItemList(item.tagName);

            return typeName === null || paletteItemNames.includes(typeName);
        });

        return paletteItems.map((item, index) => (
            <PaletteItem key={index} nodeMetadata={item} />
        ));
    }

    return (
        <Palette
            selectedTab={selectedTab}
            onSelectTab={setSelectedTab}
            tabFiller={fillTab}
        />
    );
}

export default PaletteTab;