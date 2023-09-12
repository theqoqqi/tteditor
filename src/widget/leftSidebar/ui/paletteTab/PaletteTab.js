import React, {useState} from 'react';
import {Palette} from '../../../../entities/palette';
import {useWorkspace} from '../../../../entities/workspace';
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
        let additionalItems = tab.additionalItems ?? [];

        let listedInPalette = item => {
            let typeName = item.getAttribute('name');
            let paletteItemNames = editorContext.getPaletteItemList(item.tagName);

            return paletteItemNames.includes(typeName);
        };

        let paletteItemProps = Array.from(configItems)
            .sort((a, b) => {
                let compareByA = +!listedInPalette(a);
                let compareByB = +!listedInPalette(b);

                return compareByA - compareByB;
            })
            .map(item => ({
                nodeMetadata: item,
                tag: item.tagName,
                type: item.getAttribute('name'),
                name: null,
            }));

        paletteItemProps.unshift(...additionalItems);

        paletteItemProps = paletteItemProps.map((props, index) => ({
            tabId: tab.id,
            id: `${tab.id}-${index}`,
            ...props,
        }));

        return paletteItemProps.map(item => (
            <PaletteItem {...item} />
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