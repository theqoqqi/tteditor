import styles from './AddTrigger.module.css';
import React, {useCallback} from 'react';
import AddControl from './addControl/AddControl';
import {AddTriggersCommand, Trigger, useEditor} from '../../../../../shared/lib';

function AddTrigger() {
    let editor = useEditor();

    let onAddCallback = useCallback(title => {
        let trigger = new Trigger(title);

        editor.executeCommand(new AddTriggersCommand([trigger]));
    }, [editor]);

    return (
        <div className={styles.addTrigger}>
            <AddControl onAdd={onAddCallback} />
        </div>
    );
}

export default AddTrigger;