import styles from './AddControl.module.css';
import React, {useCallback, useState} from 'react';
import PropTypes from 'prop-types';
import {BsPlusCircleFill} from 'react-icons/bs';
import {ControlContainer, PropertyInput} from '../../../../../../entities/objectEditor';

AddControl.propTypes = {
    onAdd: PropTypes.func,
};

function AddControl({ onAdd }) {
    let [item, setItem] = useState('');
    let [count, setCount] = useState('');

    let onChangeItem = useCallback(e => {
        setItem(e.target.value);
    }, []);

    let onChangeCount = useCallback(e => {
        setCount(e.target.value);
    }, []);

    let onAddCallback = useCallback(() => {
        onAdd(item, count);
        setItem('');
        setCount('');
    }, [onAdd, item, count]);

    return (
        <ControlContainer
            className={styles.addControl}
            heading={(
                <PropertyInput
                    type='text'
                    value={item}
                    placeholder='Имя объекта'
                    onChange={onChangeItem}
                />
            )}
        >
            <PropertyInput
                className={styles.addCount}
                type='number'
                value={count}
                placeholder='Количество'
                onChange={onChangeCount}
            />
            <BsPlusCircleFill
                className={styles.addIcon}
                onClick={onAddCallback}
            />
        </ControlContainer>
    );
}

export default AddControl;