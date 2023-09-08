import styles from './AddControl.module.css';
import React, {useCallback, useState} from 'react';
import PropTypes from 'prop-types';
import {BsPlusCircleFill} from 'react-icons/bs';
import {ControlContainer, PropertyInput} from '../../../../../../entities/objectEditor';

AddControl.propTypes = {
    onAdd: PropTypes.func,
};

function AddControl({ onAdd }) {
    let [title, setTitle] = useState('');

    let onChangeTitle = useCallback(e => {
        setTitle(e.target.value);
    }, []);

    let onAddCallback = useCallback(() => {
        onAdd(title);
        setTitle('');
    }, [onAdd, title]);

    return (
        <ControlContainer className={styles.addControl}>
            <PropertyInput
                className={styles.addCount}
                type='text'
                value={title}
                placeholder='Название'
                onChange={onChangeTitle}
            />
            <BsPlusCircleFill
                className={styles.addIcon}
                onClick={onAddCallback}
            />
        </ControlContainer>
    );
}

export default AddControl;