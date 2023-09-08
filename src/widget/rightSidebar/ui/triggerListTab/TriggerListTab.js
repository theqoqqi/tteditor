import styles from './TriggerListTab.module.css';
import React from 'react';
import TriggerList from './triggerList/TriggerList';
import {useMapListObserver} from '../../../../shared/lib';
import AddTrigger from './addTrigger/AddTrigger';
import TriggerEditor from './triggerEditor/TriggerEditor';
import {useSelector} from 'react-redux';
import {selectSelectedTrigger} from '../../../../entities/triggerList';

function TriggerListTab() {
    let [triggers] = useMapListObserver('triggers');
    let selectedTrigger = useSelector(selectSelectedTrigger);

    return (
        <div className={styles.triggerListTab}>
            <AddTrigger />
            <TriggerList triggers={triggers} />
            <TriggerEditor trigger={selectedTrigger} />
        </div>
    );
}

export default TriggerListTab;