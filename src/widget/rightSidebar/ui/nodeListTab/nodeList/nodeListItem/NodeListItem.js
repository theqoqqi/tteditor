import styles from './NodeListItem.module.css';
import React, {memo, useCallback, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import {getTagIconComponent, MapNode, useFirstIntersection, useObserver} from '../../../../../../shared/lib';
import {Toolbar, ToolbarSeparator} from '../../../../../../shared/ui';
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
            </>}
        </Toolbar>
    );
}

export default memo(NodeListItem);