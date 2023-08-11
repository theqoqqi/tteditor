import React from 'react';
import PropTypes from 'prop-types';
import {ListGroup, ListGroupItem} from 'react-bootstrap';

List.propTypes = {
    className: PropTypes.any,
    itemClassName: PropTypes.any,
    items: PropTypes.array,
    selected: PropTypes.object,
    onSelect: PropTypes.func,
    listItemContent: PropTypes.func.isRequired,
    keyBy: PropTypes.func,
    compareBy: PropTypes.func,
    listItemProps: PropTypes.func,
    disabled: PropTypes.bool,
};

function List({
    className,
    itemClassName,
    items = [],
    selected,
    disabled,
    onSelect = () => {},
    listItemContent = null,
    keyBy = null,
    compareBy = null,
    listItemProps,
    ...listGroupProps
}) {
    compareBy ??= item => item;

    function isSameItem(a, b) {
        return compareBy(a) === compareBy(b);
    }

    return (
        <ListGroup className={className} {...listGroupProps}>
            {items.map((item, index) => (
                <ListGroupItem
                    key={keyBy?.(item) ?? index}
                    className={itemClassName}
                    active={isSameItem(item, selected)}
                    disabled={disabled}
                    onClick={() => onSelect?.(item)}
                    action
                    {...listItemProps?.(item, index, isSameItem(item, selected))}
                >
                    {listItemContent(item, index, isSameItem(item, selected))}
                </ListGroupItem>
            ))}
        </ListGroup>
    );
}

export default List;