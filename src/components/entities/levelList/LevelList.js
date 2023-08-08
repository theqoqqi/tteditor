import styles from './LevelList.module.css';
import React from 'react';
import Level from './level/Level.js';
import PropTypes from 'prop-types';
import List from '../../shared/list/List.js';

LevelList.propTypes = {
    levels: PropTypes.array,
};

function LevelList({ levels, selected, onSelect }) {

    return (
        <List
            variant='flush'
            className={styles.levelList}
            itemClassName='px-3 py-1'
            items={levels}
            selected={selected}
            onSelect={onSelect}
            compareBy={level => level?.id}
            listItemContent={(level, index, isSelected) => (
                <Level level={level} selected={isSelected} />
            )}
        />
    );
}

export default LevelList;