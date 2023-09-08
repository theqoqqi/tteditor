import styles from './TriggerEditor.module.css';
import React, {useMemo} from 'react';
import PropTypes from 'prop-types';
import {Trigger, useListObserver, useObserver} from '../../../../../shared/lib';
import {triggerControls} from '../../../lib/triggerControls';
import {ObjectEditor} from '../../../../../entities/objectEditor';
import useTriggerEditorCallback from '../../../lib/useTriggerEditorCallback';
import {PanelHeader} from '../../../../../shared/ui';
import {BsPlayCircleFill} from 'react-icons/bs';
import {FormControl} from 'react-bootstrap';
import useTriggerStatementsEditorCallback from '../../../lib/useTriggerStatementsEditorCallback';

TriggerEditor.propTypes = {
    trigger: PropTypes.instanceOf(Trigger),
};

function TriggerEditor({ trigger }) {
    let wrappedTrigger = useMemo(() => [trigger], [trigger]);
    let [statements] = useListObserver(trigger, 'statements');
    let onChange = useTriggerEditorCallback(trigger);
    let onChangeStatements = useTriggerStatementsEditorCallback(trigger);

    useObserver(trigger, 'title');

    if (!trigger) {
        return null;
    }

    let statementsText = statements?.join('\n') ?? '';

    return (
        <div className={styles.triggerEditor}>
            <PanelHeader
                icon={BsPlayCircleFill}
                title='Редактор триггера'
            />
            <ObjectEditor
                objects={wrappedTrigger}
                controls={triggerControls}
                onChange={onChange}
            />
            <FormControl
                as='textarea'
                className={styles.statementsInput}
                value={statementsText}
                onChange={onChangeStatements}
            />
        </div>
    );
}

export default TriggerEditor;