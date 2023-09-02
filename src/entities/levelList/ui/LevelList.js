import styles from './LevelList.module.css';
import React from 'react';
import Level from './level/Level';
import PropTypes from 'prop-types';
import {List} from '../../../shared/ui';

LevelList.propTypes = {
    levels: PropTypes.array,
    selected: PropTypes.object,
    onSelect: PropTypes.func,
    isSelectedLevelDirty: PropTypes.bool,
};

function LevelList({ levels, selected, onSelect, isSelectedLevelDirty }) {

    return (
        <List
            variant='flush'
            className={styles.levelList}
            itemClassName='px-3 py-1'
            items={levels}
            selectedItem={selected}
            disabled={isSelectedLevelDirty}
            onSelect={onSelect}
            keyBy={level => level?.path}
            compareBy={level => level?.path}
            listItemContent={(level, index, isSelected) => (
                <Level level={level} selected={isSelected} changed={isSelected && isSelectedLevelDirty} />
            )}
        />
    );
}

export default LevelList;