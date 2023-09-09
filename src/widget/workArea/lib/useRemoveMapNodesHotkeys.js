import {useRemoveMapNodes} from '../../../features/node';
import {useHotkeys} from 'react-hotkeys-hook';
import {hotkeys} from '../../../features/globalHotkeys';
import {useCallback} from 'react';

export default function useRemoveMapNodesHotkeys(mapNodes) {
    let removeMapNodes = useRemoveMapNodes();
    let callback = useCallback(() => {
        return removeMapNodes(mapNodes);
    }, [removeMapNodes, mapNodes]);

    useHotkeys(hotkeys.delete, callback);
}
