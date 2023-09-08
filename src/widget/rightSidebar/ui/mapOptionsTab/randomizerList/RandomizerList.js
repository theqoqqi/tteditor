import styles from './RandomizerList.module.css';
import React, {useCallback} from 'react';
import PropTypes from 'prop-types';
import {
    AddRandomizersCommand,
    RandomizerOption,
    RemoveRandomizersCommand,
    SetRandomizerPropertyCommand,
    useEditor
} from '../../../../../shared/lib';
import {Control} from '../../../../../entities/objectEditor';
import AddControl from './addControl/AddControl';
import {useUpdate} from 'react-use';

const property = {
    type: 'number',
    name: 'count',
};

RandomizerList.propTypes = {
    randomizers: PropTypes.arrayOf(PropTypes.instanceOf(RandomizerOption)),
};

function RandomizerList({ randomizers }) {
    let editor = useEditor();
    let update = useUpdate();

    let onAddCallback = useCallback((item, count) => {
        let randomizer = new RandomizerOption(item, count);

        editor.executeCommand(new AddRandomizersCommand([randomizer]));
        update();
    }, [editor, update]);

    let onRemoveCallback = useCallback(({ objects }) => {
        editor.executeCommand(new RemoveRandomizersCommand(objects));
        update();
    }, [editor, update]);

    let onChangeCallback = useCallback(([{ objects, newValue }]) => {
        editor.executeCommand(new SetRandomizerPropertyCommand(objects[0], 'count', newValue));
        update();
    }, [editor, update]);

    return (
        <div className={styles.randomizerList}>
            {randomizers.map(randomizer => (
                <Control
                    key={randomizer.editorId}
                    objects={[randomizer]}
                    title={randomizer.item}
                    property={property}
                    removable
                    onChange={onChangeCallback}
                    onRemove={onRemoveCallback}
                />
            ))}
            <AddControl onAdd={onAddCallback} />
        </div>
    );
}

export default RandomizerList;