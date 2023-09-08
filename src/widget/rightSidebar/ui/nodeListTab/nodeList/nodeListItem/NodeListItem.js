import styles from './NodeListItem.module.css';
import React, {memo, useCallback, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import {
    getTagIconComponent,
    MapNode,
    RemoveNodesCommand,
    useEditor,
    useFirstIntersection,
    useObserver
} from '../../../../../../shared/lib';
import {BsEyeFill, BsEyeSlashFill, BsPlusCircle, BsXCircleFill} from 'react-icons/bs';
import {useDispatch} from 'react-redux';
import {focusCameraAtMapNode} from '../../../../../../entities/focus';
import {toggleMapNodeVisibility} from '../../../../../../entities/hiddenNodes';
import {CompactListItem, IconButton, Separator} from '../../../../../../shared/ui';

NodeListItem.propTypes = {
    mapNode: PropTypes.instanceOf(MapNode),
    selected: PropTypes.bool,
    focused: PropTypes.bool,
    hidden: PropTypes.bool,
};

function NodeListItem({ mapNode, selected, focused, hidden }) {
    /** @type React.Ref<HTMLDivElement> */
    let ref = useRef();
    let isVisible = useFirstIntersection(ref);
    let editor = useEditor();
    let x = useObserver(mapNode, 'x');
    let y = useObserver(mapNode, 'y');
    let tag = useObserver(mapNode, 'tag');
    let type = useObserver(mapNode, 'type');
    let name = useObserver(mapNode, 'name');
    let dispatch = useDispatch();

    useEffect(() => {
        if (focused) {
            ref.current.scrollIntoView({
                behavior: 'instant',
                block: 'center',
            });
        }
    }, [focused]);

    let onToggle = useCallback(e => {
        e.stopPropagation();

        dispatch(toggleMapNodeVisibility(mapNode));
    }, [dispatch, mapNode]);

    let onFocus = useCallback(e => {
        e.stopPropagation();

        dispatch(focusCameraAtMapNode({ x, y }));
    }, [dispatch, x, y]);

    let onRemove = useCallback(e => {
        e.stopPropagation();

        editor.executeCommand(new RemoveNodesCommand([mapNode]));
    }, [editor, mapNode]);

    let Icon = getTagIconComponent(tag);

    return (
        <CompactListItem
            itemRef={ref}
            selected={selected}
            hidden={hidden}
            onDoubleClick={onFocus}
        >
            {isVisible && <>
                <Icon className={styles.icon} />
                <Separator />
                <span className={styles.tag}>
                    {tag}
                </span>
                <Separator />
                <span className={styles.type}>
                    {type ?? name}
                </span>
                <Separator />
                <span className={styles.coord}>
                    {x}
                </span>
                <Separator />
                <span className={styles.coord}>
                    {y}
                </span>
                <Separator />
                <IconButton
                    itemSelected={selected}
                    toggle
                    active={!hidden}
                    title={hidden ? 'Показать объект' : 'Скрыть объект'}
                    icon={hidden ? BsEyeSlashFill : BsEyeFill}
                    onClick={onToggle}
                />
                <IconButton
                    itemSelected={selected}
                    title='В центр экрана'
                    icon={BsPlusCircle}
                    onClick={onFocus}
                />
                <IconButton
                    itemSelected={selected}
                    title='Удалить объект'
                    icon={BsXCircleFill}
                    onClick={onRemove}
                />
            </>}
        </CompactListItem>
    );
}

export default memo(NodeListItem);