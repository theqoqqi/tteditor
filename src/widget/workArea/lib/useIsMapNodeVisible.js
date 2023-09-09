import {useSelector} from 'react-redux';
import {selectVisibleLayers} from '../../../entities/layers';
import {selectHiddenMapNodes} from '../../../entities/hiddenNodes';
import {useCallback} from 'react';
import {EditorContext} from '../../../shared/lib';

export default function useIsMapNodeVisible() {
    let visibleLayers = useSelector(selectVisibleLayers);
    let hiddenMapNodes = useSelector(selectHiddenMapNodes);

    return useCallback(mapNode => {
        let layerName = EditorContext.getLayerNameByTagName(mapNode.tag);
        let isLayerVisible = visibleLayers.includes(layerName);
        let isHidden = hiddenMapNodes.includes(mapNode);

        return isLayerVisible && !isHidden;
    }, [hiddenMapNodes, visibleLayers]);
}
