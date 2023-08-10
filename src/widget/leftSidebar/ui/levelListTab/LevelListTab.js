import React, {useState} from 'react';
import {LevelList} from '../../../../entities/levelList';

function LevelListTab({}) {
    let [levels, setLevels] = useState([]);
    let [selected, setSelected] = useState(null);

    function onSelect(level) {
        setSelected(level);
    }

    return (
        <LevelList
            levels={levels}
            selected={selected}
            onSelect={onSelect}
        />
    );
}

export default LevelListTab;