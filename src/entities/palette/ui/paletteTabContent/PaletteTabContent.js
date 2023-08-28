import styles from './PaletteTabContent.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import {useEditorContext, useWorkspace} from '../../../editor';
import {PaletteItem} from '../../../../features/palette/item';

PaletteTabContent.propTypes = {
    configName: PropTypes.string,
};

function PaletteTabContent({ configName }) {
    let editorContext = useEditorContext();
    let { workspacePath } = useWorkspace();

    if (!workspacePath) {
        return null;
    }

    let config = editorContext.getConfigByName(configName);
    let items = config.querySelectorAll(':scope > *');

    let filteredItems = Array.from(items).filter(item => {
        let typeName = item.getAttribute('name');
        let paletteItemNames = editorContext.getPaletteItemList(item.tagName);

        return typeName === null || paletteItemNames.includes(typeName);
    });

    return (
        <div className={styles.paletteTabContent}>
            {filteredItems.map((item, index) => (
                <PaletteItem key={index} nodeMetadata={item} />
            ))}
        </div>
    );
}

export default PaletteTabContent;