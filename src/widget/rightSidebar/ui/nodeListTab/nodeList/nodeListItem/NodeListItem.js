import styles from './NodeListItem.module.css';
import React, {memo, useRef} from 'react';
import PropTypes from 'prop-types';
import {getTagIconComponent, MapNode, useFirstIntersection, useObserver} from '../../../../../../shared/lib';
import {Toolbar, ToolbarSeparator} from '../../../../../../shared/ui';
import classNames from 'classnames';

NodeListItem.propTypes = {
    mapNode: PropTypes.instanceOf(MapNode),
    selected: PropTypes.bool,
};

function NodeListItem({ mapNode, selected }) {
    /** @type React.Ref<HTMLDivElement> */
    let ref = useRef();
    let isVisible = useFirstIntersection(ref);
    let x = useObserver(mapNode, 'x');
    let y = useObserver(mapNode, 'y');
    let tag = useObserver(mapNode, 'tag');
    let type = useObserver(mapNode, 'type');
    let name = useObserver(mapNode, 'name');

    let Icon = getTagIconComponent(tag);

    return (
        <Toolbar
            itemRef={ref}
            className={classNames(styles.nodeListItem, {
                [styles.selected]: selected,
            })}
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