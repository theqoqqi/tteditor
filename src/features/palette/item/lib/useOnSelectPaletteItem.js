import {SetTerrainCommand, useEditor, useEditorContext, useMap} from '../../../../shared/lib';
import {useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {setSelectedPaletteItem} from '../../../../entities/palette';
import {setBrushMapNodes} from '../../../../entities/brush';
import {pointerModes, setPointerMode} from '../../../../entities/pointerMode';
import useAudioPlayer from './useAudioPlayer';

export default function useOnSelectPaletteItem(tabId, itemId, tag, type, mapNodes) {
    let editor = useEditor();
    let editorContext = useEditorContext();
    let map = useMap();
    let dispatch = useDispatch();
    let audioPlayer = useAudioPlayer();

    let onSelect = useCallback(async () => {
        dispatch(setSelectedPaletteItem({
            tabId,
            itemId,
        }));

        if (tag === 'ambient') {
            let sound = await editorContext.getSoundFor(tag, type);

            if (sound) {
                let soundUrl = editorContext.getFileUrl(sound);

                audioPlayer.play(soundUrl);
            }
        }

        if (!map) {
            return;
        }

        if (tag === 'terrain') {
            let terrain = await editorContext.createTerrainByName(type);

            editor.executeCommand(new SetTerrainCommand(map, terrain));
        } else {
            dispatch(setPointerMode(pointerModes.insert.name));
            dispatch(setBrushMapNodes(mapNodes.map(mapNode => mapNode.clone())));
        }
    }, [dispatch, editor, editorContext, map, tabId, itemId, tag, type, mapNodes, audioPlayer]);

    return onSelect;
}
