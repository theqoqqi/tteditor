import React, {useEffect, useState} from 'react';
import {LevelList} from '../../../../entities/levelList';
import {useEditor, useEditorObserver} from '../../../../shared/editor';
import {useAsync} from 'react-use';

function LevelListTab() {
    let editor = useEditor();
    let [levels, setLevels] = useState([]);
    let [selected, setSelected] = useState(null);
    let asyncLevelList = useAsync(() => editor.loadLevelList(), [editor]);
    let isLevelDirty = useEditorObserver('isLevelDirty');

    useEffect(() => {
        setLevels(asyncLevelList.value);
    }, [asyncLevelList]);

    useEffect(() => {
        if (selected) {
            editor.loadLevel(selected.path)
                .catch(e => console.error(e));
        }
    }, [editor, selected]);

    return (
        <LevelList
            levels={levels}
            selected={selected}
            onSelect={setSelected}
            isSelectedLevelDirty={isLevelDirty}
        />
    );
}

export default LevelListTab;