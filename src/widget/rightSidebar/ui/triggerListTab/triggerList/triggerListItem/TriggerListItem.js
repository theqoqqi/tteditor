import styles from './TriggerListItem.module.css';
import React, {memo, useCallback, useRef} from 'react';
import PropTypes from 'prop-types';
import {
    RemoveTriggersCommand,
    SetTriggerEnabledCommand,
    SetTriggerPropertyCommand,
    Trigger,
    useEditor,
    useFirstIntersection,
    useListObserver,
    useObserver
} from '../../../../../../shared/lib';
import {
    BsArrowRepeat,
    BsArrowRight,
    BsFileEarmarkFont,
    BsPlayCircleFill,
    BsStopCircleFill,
    BsXCircleFill
} from 'react-icons/bs';
import {CompactListItem, IconButton, Separator} from '../../../../../../shared/ui';

TriggerListItem.propTypes = {
    trigger: PropTypes.instanceOf(Trigger),
    selected: PropTypes.bool,
};

function TriggerListItem({ trigger, selected }) {
    /** @type React.Ref<HTMLDivElement> */
    let ref = useRef();
    let isVisible = useFirstIntersection(ref);
    let editor = useEditor();
    let title = useObserver(trigger, 'title');
    let repeat = useObserver(trigger, 'repeat');

    useListObserver(trigger, 'statements');

    let enabled = !trigger.hasStatementOfType('never');

    let onToggleRepeat = useCallback(e => {
        e.stopPropagation();

        editor.executeCommand(new SetTriggerPropertyCommand(trigger, 'repeat', !repeat));
    }, [editor, trigger, repeat]);

    let onToggleEnabled = useCallback(e => {
        e.stopPropagation();

        editor.executeCommand(new SetTriggerEnabledCommand(trigger, !enabled));
    }, [editor, trigger, enabled]);

    let onRemove = useCallback(e => {
        e.stopPropagation();

        editor.executeCommand(new RemoveTriggersCommand([trigger]));
    }, [editor, trigger]);

    return (
        <CompactListItem
            itemRef={ref}
            selected={selected}
            hidden={!enabled}
        >
            {isVisible && <>
                <BsFileEarmarkFont className={styles.icon} />
                <Separator />
                <span className={styles.title}>
                    {title}
                </span>
                <Separator />
                <IconButton
                    itemSelected={selected}
                    toggle
                    active={repeat}
                    title={repeat ? 'Отключить повторение' : 'Включить повторение'}
                    icon={repeat ? BsArrowRepeat : BsArrowRight}
                    onClick={onToggleRepeat}
                />
                <IconButton
                    itemSelected={selected}
                    toggle
                    active={enabled}
                    title={enabled ? 'Отключить триггер' : 'Включить триггер'}
                    icon={enabled ? BsPlayCircleFill : BsStopCircleFill}
                    onClick={onToggleEnabled}
                />
                <IconButton
                    itemSelected={selected}
                    title='Удалить триггер'
                    icon={BsXCircleFill}
                    onClick={onRemove}
                />
            </>}
        </CompactListItem>
    );
}

export default memo(TriggerListItem);