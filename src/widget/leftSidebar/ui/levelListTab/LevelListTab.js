import React, {useEffect, useState} from 'react';
import {LevelList} from '../../../../entities/levelList';
import {useWorkspace} from '../../../../entities/editor';
import {useEditor, useEditorObserver} from '../../../../shared/lib';
import {useAsync} from 'react-use';
import {useLoadLevel} from '../../../../features/level';

function LevelListTab() {
    let editor = useEditor();
    let { workspacePath } = useWorkspace();
    let [levels, setLevels] = useState([]);
    let [selected, setSelected] = useState(null);
    let asyncLevelList = useAsync(() => editor.loadLevelList(), [editor, workspacePath]);
    let isLevelDirty = useEditorObserver('isLevelDirty');
    let loadLevel = useLoadLevel();

    useEffect(() => {
        setLevels(asyncLevelList.value);
    }, [asyncLevelList]);

    useEffect(() => {
        if (selected) {
            loadLevel(selected.path)
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