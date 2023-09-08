import styles from './TriggerListTab.module.css';
import React from 'react';
import TriggerList from './triggerList/TriggerList';
import {useMapListObserver} from '../../../../shared/lib';
import AddTrigger from './addTrigger/AddTrigger';

function TriggerListTab() {
    let [triggers] = useMapListObserver('triggers');

    return (
        <div className={styles.triggerListTab}>
            <AddTrigger />
            <TriggerList triggers={triggers} />
        </div>
    );
}

export default TriggerListTab;