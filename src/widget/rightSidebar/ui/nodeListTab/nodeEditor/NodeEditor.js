import styles from './NodeEditor.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import {ObjectEditor} from '../../../../../entities/objectEditor';
import {MapNode, useObserver} from '../../../../../shared/lib';
import {BsGearFill} from 'react-icons/bs';
import {PanelHeader} from '../../../../../shared/ui';
import {getVisibleControls} from '../../../lib/nodeControls';
import useNodeEditorCallback from '../../../lib/useNodeEditorCallback';

NodeEditor.propTypes = {
    mapNodes: PropTypes.arrayOf(PropTypes.instanceOf(MapNode)),
};

function NodeEditor({ mapNodes }) {
    let tags = useObserver(mapNodes, 'tag');

    useObserver(mapNodes, 'type');
    useObserver(mapNodes, 'name');
    useObserver(mapNodes, 'group');
    useObserver(mapNodes, 'x');
    useObserver(mapNodes, 'y');
    useObserver(mapNodes, 'radius');
    useObserver(mapNodes, 'hint');
    useObserver(mapNodes, 'owner');
    useObserver(mapNodes, 'subId');

    let onChange = useNodeEditorCallback(mapNodes);

    let visibleControls = getVisibleControls(tags);

    if (!mapNodes || mapNodes.length === 0) {
        return null;
    }

    return (
        <div className={styles.nodeEditor}>
            <PanelHeader
                icon={BsGearFill}
                title='Свойства объекта'
            />
            <ObjectEditor
                objects={mapNodes}
                controls={visibleControls}
                onChange={onChange}
            />
        </div>
    );
}

export default NodeEditor;