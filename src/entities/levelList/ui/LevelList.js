import styles from './LevelList.module.css';
import React from 'react';
import Level from './level/Level.js';
import PropTypes from 'prop-types';
import {List} from '../../../shared/list';

LevelList.propTypes = {
    levels: PropTypes.array,
    isSelectedLevelDirty: PropTypes.bool,
};

function LevelList({ levels, selected, onSelect, isSelectedLevelDirty }) {

    return (
        <List
            variant='flush'
            className={styles.levelList}
            itemClassName='px-3 py-1'
            items={levels}
            selected={selected}
            disabled={isSelectedLevelDirty}
            onSelect={onSelect}
            compareBy={level => level?.id}
            listItemContent={(level, index, isSelected) => (
                <Level level={level} selected={isSelected} changed={isSelected && isSelectedLevelDirty} />
            )}
        />
    );
}

export default LevelList;