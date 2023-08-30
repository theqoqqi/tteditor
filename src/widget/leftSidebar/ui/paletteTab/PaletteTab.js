import React, {useState} from 'react';
import {Palette} from '../../../../entities/palette';
import {useWorkspace} from '../../../../entities/editor';
import {useEditorContext} from '../../../../shared/lib';
import {PaletteItem} from '../../../../features/palette';

function PaletteTab() {
    let editorContext = useEditorContext();
    let { workspacePath } = useWorkspace();
    let [selectedTab, setSelectedTab] = useState(0);

    if (!workspacePath) {
        return null;
    }

    function fillTab(tab) {
        let config = editorContext.getConfigByName(tab.configName);
        let configItems = config.querySelectorAll(':scope > *');

        let paletteItemProps = Array.from(configItems)
            .filter(item => {
                let typeName = item.getAttribute('name');
                let paletteItemNames = editorContext.getPaletteItemList(item.tagName);

                return typeName === null || paletteItemNames.includes(typeName);
            })
            .map(item => ({
                nodeMetadata: item,
                tag: item.tagName,
                type: item.getAttribute('name'),
                name: null,
            }));

        return paletteItemProps.map((item, index) => (
            <PaletteItem key={index} {...item} />
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