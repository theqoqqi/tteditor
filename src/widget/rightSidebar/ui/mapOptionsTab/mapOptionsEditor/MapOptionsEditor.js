import styles from './MapOptionsEditor.module.css';
import React, {useMemo} from 'react';
import PropTypes from 'prop-types';
import {MapOptions, useObserver} from '../../../../../shared/lib';
import {ObjectEditor} from '../../../../../entities/objectEditor';
import {mapOptionsControls} from '../../../lib/mapOptionsControls';
import useMapOptionsEditorCallback from '../../../lib/useMapOptionsEditorCallback';

MapOptionsEditor.propTypes = {
    options: PropTypes.instanceOf(MapOptions),
};

function MapOptionsEditor({ options }) {
    let wrappedOptions = useMemo(() => [options], [options]);
    let onChange = useMapOptionsEditorCallback(options);

    useObserver(options, 'id');
    useObserver(options, 'music');
    useObserver(options, 'coloring');
    useObserver(options, 'fowClearColor');

    if (!options) {
        return null;
    }

    return (
        <div className={styles.mapEditor}>
            <ObjectEditor
                objects={wrappedOptions}
                controls={mapOptionsControls}
                onChange={onChange}
            />
        </div>
    );
}

export default MapOptionsEditor;