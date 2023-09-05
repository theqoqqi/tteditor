import styles from './ObjectEditor.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import Control from './control/Control';

ObjectEditor.propTypes = {
    objects: PropTypes.arrayOf(PropTypes.object),
    controls: PropTypes.arrayOf(PropTypes.shape({
        controlName: PropTypes.string,
        ...Control.propTypes,
    })),
    onChange: PropTypes.func,
};

function ObjectEditor({ objects, controls, onChange }) {
    return (
        <div className={styles.objectEditor}>
            {controls.map(({ controlName, ...controlProps }) => (
                <Control
                    key={controlName}
                    objects={objects}
                    onChange={onChange}
                    {...controlProps}
                />
            ))}
        </div>
    );
}

export default ObjectEditor;