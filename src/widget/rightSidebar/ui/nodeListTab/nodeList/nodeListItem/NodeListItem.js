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
import {BsPlusCircle, BsXCircleFill} from 'react-icons/bs';
import {useDispatch} from 'react-redux';
import {focusCameraAtMapNode} from '../../../../../../entities/focus';
import classNames from 'classnames';

NodeListItem.propTypes = {
    mapNode: PropTypes.instanceOf(MapNode),
    selected: PropTypes.bool,
    focused: PropTypes.bool,
};

function NodeListItem({ mapNode, selected, focused }) {
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