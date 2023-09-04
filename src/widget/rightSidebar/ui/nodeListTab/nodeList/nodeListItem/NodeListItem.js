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
import {Toolbar, ToolbarIconButton, ToolbarSeparator} from '../../../../../../shared/ui';
import {BsEyeFill, BsEyeSlashFill, BsPlusCircle, BsXCircleFill} from 'react-icons/bs';
import {useDispatch} from 'react-redux';
import {focusCameraAtMapNode} from '../../../../../../entities/focus';
import classNames from 'classnames';
import {toggleMapNodeVisibility} from '../../../../../../entities/hiddenNodes';

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
        <Toolbar
            itemRef={ref}
            className={classNames(styles.nodeListItem, {
                [styles.selected]: selected,
                [styles.hidden]: hidden,
            })}
            onDoubleClick={onFocus}
        >
            {isVisible && <>
                <Icon className={styles.icon} />
                <ToolbarSeparator className={styles.separator} />
                <span className={styles.tag}>
                    {tag}
                </span>
                <ToolbarSeparator className={styles.separator} />
                <span className={styles.type}>
                    {type ?? name}
                </span>
                <ToolbarSeparator className={styles.separator} />
                <span className={styles.coord}>
                    {x}
                </span>
                <ToolbarSeparator className={styles.separator} />
                <span className={styles.coord}>
                    {y}
                </span>
                <ToolbarSeparator className={styles.separator} />
                <ToolbarIconButton
                    className={classNames(styles.button, {
                        [styles.active]: !hidden,
                    })}
                    iconClassName={styles.buttonIcon}
                    toggle
                    active={!hidden}
                    title={hidden ? 'Показать объект' : 'Скрыть объект'}
                    icon={hidden ? BsEyeSlashFill : BsEyeFill}
                    onClick={onToggle}
                />
                <ToolbarIconButton
                    className={styles.button}
                    iconClassName={styles.buttonIcon}
                    title='В центр экрана'
                    icon={BsPlusCircle}
                    onClick={onFocus}
                />
                <ToolbarIconButton
                    className={styles.button}
                    iconClassName={styles.buttonIcon}
                    title='Удалить объект'
                    icon={BsXCircleFill}
                    onClick={onRemove}
                />
            </>}
        </Toolbar>
    );
}

export default memo(NodeListItem);