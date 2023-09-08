import styles from './TriggerList.module.css';
import React, {useCallback} from 'react';
import PropTypes from 'prop-types';
import {Trigger} from '../../../../../shared/lib';
import TriggerListItem from './triggerListItem/TriggerListItem';
import {List} from '../../../../../shared/ui';
import {useDispatch, useSelector} from 'react-redux';
import classNames from 'classnames';
import {selectSelectedTrigger, setSelectedTrigger} from '../../../../../entities/triggerList';

TriggerList.propTypes = {
    triggers: PropTypes.arrayOf(PropTypes.instanceOf(Trigger)),
};

function TriggerList({ triggers }) {
    triggers ??= [];

    let dispatch = useDispatch();
    let selectedTrigger = useSelector(selectSelectedTrigger);

    let onClickTrigger = useCallback(trigger => {
        dispatch(setSelectedTrigger(trigger));
    }, [dispatch]);

    return (
        <List
            className={styles.triggerList}
            items={triggers}
            selectedItems={[selectedTrigger]}
            onSelect={onClickTrigger}
            keyBy={trigger => trigger?.editorId}
            compareBy={trigger => trigger?.editorId}
            listItemProps={(trigger, index, isSelected) => ({
                className: classNames('p-0 border-0', {
                    [styles.selected]: isSelected,
                }),
            })}
            listItemContent={(trigger, index, isSelected) => (
                <TriggerListItem
                    trigger={trigger}
                    selected={isSelected}
                />
            )}
        />
    );
}

export default TriggerList;